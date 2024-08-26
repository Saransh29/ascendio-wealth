import yfinance as yf
from datetime import datetime, timedelta
from .llm_service import LLMService
from .cache_service import CacheService
from ..utils.helpers import get_article_text
import ast
import json
import logging
import asyncio
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
import os


class StockService:
    def __init__(self):
        self.llm_service = LLMService()
        self.cache_service = CacheService()
        self.CACHE_FILE = 'sp500_cache.csv'
        self.CACHE_EXPIRY_DAYS = 30

    async def analyze_industry(self, industry):
        try:
            cache_key = f"analyze_industry_{industry}"
            print("HERE industry", industry)
            # cached_result = await self.cache_service.get(cache_key)
            # print("CACHE", cached_result)
            # print (type(cached_result))
            # if cached_result:
            #     return json.loads(cached_result)

            tickers = await self.generate_ticker_ideas(industry)
            print("TICKERS", tickers)
            analyses = {}
            prices = {}
            industry_analsyis = {}

            async def analyze_ticker(ticker):
                analysis = await self.analyze_stock(ticker)
                if analysis is None:
                    raise ValueError(
                        f"Analysis for ticker {ticker} returned None")
                return ticker, analysis['final_analysis'], analysis['price'], analysis

            tasks = [analyze_ticker(ticker) for ticker in tickers]
            results = await asyncio.gather(*tasks)

            for ticker, final_analysis, price, analysis in results:
                if ticker not in industry_analsyis:
                    industry_analsyis[ticker] = analysis
                analyses[ticker] = final_analysis
                prices[ticker] = price

            ranking = await self.rank_companies(industry, analyses, prices)
            result = {"tickers": tickers,
                      "analyses": analyses, "ranking": ranking}
            # result = {"tickers": tickers, "analyses": analyses, "ranking": ranking, industry_analsyis: industry_analsyis}

            # await self.cache_service.set(cache_key, result, expiration=3600)  # Cache for 1 hour
            return result
        except Exception as e:
            print("ERROR", e)
            logging.error(f"Error in analyze_industry: {str(e)}")
            return {"error": "An error occurred while analyzing the industry"}

    async def analyze_stock(self, ticker):
        try:
            cache_key = f"analyze_stock_{ticker}"
            cached_result = await self.cache_service.get(cache_key)
            if cached_result:
                return cached_result
            print("============================================")
            print("Analysing TICKER:", ticker)

            news = await self.get_stock_data(ticker, 1)

            sentiment_task = self.get_sentiment_analysis(ticker, news)
            analyst_ratings_task = self.get_analyst_ratings(ticker)
            industry_analysis_task = self.get_industry_analysis(ticker)

            sentiment_analysis, analyst_ratings, industry_analysis = await asyncio.gather(
                sentiment_task, analyst_ratings_task, industry_analysis_task
            )

            final_analysis = await self.get_final_analysis(ticker, {}, sentiment_analysis, analyst_ratings, industry_analysis)

            price = await self.get_current_price(ticker)

            print("============================================")
            result = {
                "sentiment_analysis": sentiment_analysis,
                "analyst_ratings": analyst_ratings,
                "industry_analysis": industry_analysis,
                "final_analysis": final_analysis,
                "price": price
            }

            # TODO: FIX THIS
            # if result:
            #     await self.cache_service.set(cache_key, json.dumps(result), expiration=1800)  # Cache for 30 minutes
            return result
        except Exception as e:
            logging.error(f"Error in analyze_stock for {ticker}: {str(e)}")
            return {"error": f"An error occurred while analyzing {ticker}"}

    async def get_stock_data(self, ticker, years):
        try:
            cache_key = f"stock_data_{ticker}_{years}"
            cached_result = await self.cache_service.get(cache_key)
            if cached_result:
                return json.loads(cached_result)
            stock = yf.Ticker(ticker)

            news = stock.news
            if news:
                # Cache for 1 hour
                await self.cache_service.set(cache_key, json.dumps(news), expiration=3600)
            return news
        except Exception as e:
            logging.error(f"Error in get_stock_data for {ticker}: {str(e)}")
            return {"error": f"An error occurred while fetching stock data for {ticker}"}

    async def generate_ticker_ideas(self, industry):
        try:
            cache_key = f"ticker_ideas_{industry}"
            cached_result = await self.cache_service.get(cache_key)
            if cached_result:
                print("CACHE HIT", cache_key)
                return json.loads(cached_result)

            system_prompt = f"You are a financial assistant. You carefully follow instructions. Don't return markdown. Don't return backticks. Don't return any code, just return a python-parseable list. "
            input_text = f"Please provide a list of 5 ticker symbols for major companies in the {industry} industry as a Python-parseable list. Only respond with the list, no other text. "

            response = await self.llm_service.generate_text(system_prompt, input_text)
            ticker_list = ast.literal_eval(response)
            result = [ticker.strip() for ticker in ticker_list]

            # Cache for 24 hours
            await self.cache_service.set(cache_key, json.dumps(result), expiration=86400)
            return result
        except Exception as e:
            logging.error(
                f"Error in generate_ticker_ideas for {industry}: {str(e)}")
            return []

    async def get_sentiment_analysis(self, ticker, news):
        try:
            cache_key = f"sentiment_analysis_{ticker}"
            cached_result = await self.cache_service.get(cache_key)
            if cached_result:
                print("CACHE HIT", cache_key)
                return cached_result.decode('utf-8')

            system_prompt = f"You are a sentiment analysis assistant. Analyze the sentiment of the given news articles for {ticker} and provide a summary of the overall sentiment and any notable changes over time. Be measured and discerning. You are a skeptical investor. Be precise and to the point."

            news_text = ""
            for article in news[:5]:
                print(f"analyzing article {article['title']}")
                article_text = get_article_text(article['link'])
                timestamp = datetime.fromtimestamp(
                    article['providerPublishTime']).strftime("%Y-%m-%d")
                news_text += f"\n\n---\n\nDate: {timestamp}\nTitle: {article['title']}\nText: {article_text}"

            input_text = f"News articles for {ticker}:\n{news_text}\n\n----\n\nProvide a summary of the overall sentiment and any notable changes over time. \n\n Summary:"

            response = await self.llm_service.generate_text(system_prompt, input_text, max_tokens=350)

            if response:
                # Cache for 2 hours
                await self.cache_service.set(cache_key, response, expiration=7200)
            return response
        except Exception as e:
            logging.error(
                f"Error in get_sentiment_analysis for {ticker}: {str(e)}")
            return "Unable to retrieve sentiment analysis"

    async def get_analyst_ratings(self, ticker):
        cache_key = f"analyst_ratings_{ticker}"
        cached_result = await self.cache_service.get(cache_key)
        if cached_result:
            return cached_result.decode('utf-8')

        try:
            stock = yf.Ticker(ticker)
            recommendations = stock.recommendations
            if recommendations is None or recommendations.empty:
                result = "No analyst ratings available."
            else:
                latest_recommendation = recommendations.iloc[0]

                total_ratings = latest_recommendation['strongBuy'] + latest_recommendation['buy'] + \
                    latest_recommendation['hold'] + latest_recommendation['sell'] + \
                    latest_recommendation['strongSell']

                if total_ratings == 0:
                    result = "No analyst ratings available."
                else:
                    weighted_sum = (1 * latest_recommendation['strongBuy'] +
                                    2 * latest_recommendation['buy'] +
                                    3 * latest_recommendation['hold'] +
                                    4 * latest_recommendation['sell'] +
                                    5 * latest_recommendation['strongSell'])

                    average_rating = weighted_sum / total_ratings

                    if average_rating <= 1.5:
                        category = "Strong Buy"
                    elif average_rating <= 2.5:
                        category = "Buy"
                    elif average_rating <= 3.5:
                        category = "Hold"
                    elif average_rating <= 4.5:
                        category = "Sell"
                    else:
                        category = "Strong Sell"

                    result = f"Average rating: {average_rating:.2f} ({category})"
        except Exception as e:
            result = f"Error retrieving analyst ratings: {str(e)}"

        # Cache for 1 hour
        await self.cache_service.set(cache_key, result, expiration=3600)
        return result

    async def get_industry_analysis(self, ticker):
        cache_key = f"industry_analysis_{ticker}"
        cached_result = await self.cache_service.get(cache_key)
        if cached_result:
            print("CACHE HIT", cache_key)
            return cached_result

        try:
            stock = yf.Ticker(ticker)
            industry = stock.info['industry']
            sector = stock.info['sector']

            print(f"industry: {industry}, sector: {sector}")

            system_prompt = f"You are a financial industry analysis assistant. Provide an comprehensive analysis including trends, growth prospects, regulatory changes, and competitive landscape. Be measured and discerning. Truly think about the positives and negatives of the stock. Be sure of your analysis. You are a skeptical investor. You carefully follow instructions. Don't return markdown. Don't return backticks."
            input_text = f"Provide an analysis of the {industry} industry and {sector} sector in max 200 words."

            response = await self.llm_service.generate_text(system_prompt, input_text, max_tokens=200)

            # Cache for 24 hours
            await self.cache_service.set(cache_key, response, expiration=86400)
            return response

        except:
            result = "Unable to retrieve industry analysis."
            # Cache for 1 hour
            await self.cache_service.set(cache_key, result, expiration=3600)
            return result

    async def get_final_analysis(self, ticker, comparisons, sentiment_analysis, analyst_ratings, industry_analysis):
        cache_key = f"final_analysis_{ticker}"
        cached_result = await self.cache_service.get(cache_key)
        if cached_result:
            print("CACHE HIT", cache_key)
            return cached_result

        try:
            system_prompt = f"You are a financial analyst providing a final investment recommendation for {ticker} based on the given data and analyses. Be measured and discerning. Truly think about the positives and negatives of the stock. Be sure of your analysis. You are a skeptical investor."
            input_text = f"Ticker: {ticker} \n\n Comparative Analysis:\n{json.dumps(comparisons, indent=2)}\n\n Sentiment Analysis:\n{sentiment_analysis}\ n\nAnalyst Ratings:\n{analyst_ratings}\n\n Industry Analysis:\n{industry_analysis}\n\nBased on the provided data and analyses, please provide a comprehensive investment analysis and recommendation for {ticker}. Consider the company's financial strength, growth prospects, competitive position, and potential risks. Provide a clear and concise recommendation on whether to buy, hold, or sell the stock, along with supporting rationale."

            response = await self.llm_service.generate_text(system_prompt, input_text, max_tokens=400)

            # Cache for 1 hour
            await self.cache_service.set(cache_key, response, expiration=3600)
            return response

        except:
            result = "Unable to retrieve analysis."
            # Cache for 1 hour
            await self.cache_service.set(cache_key, result, expiration=3600)
            return result

    async def get_current_price(self, ticker):
        try:
            cache_key = f"current_price_{ticker}"
            cached_result = await self.cache_service.get(cache_key)
            if cached_result:
                return cached_result

            stock = yf.Ticker(ticker)
            data = stock.history(period='1d', interval='1m')
            result = data['Close'][-1]

            price = float(result)

            if result:
                # Cache for 1 minute
                await self.cache_service.set(cache_key, price, expiration=60)
            return price
        except Exception as e:
            logging.error(f"Error in get_current_price for {ticker}: {str(e)}")
            return None

    async def rank_companies(self, industry, analyses, prices):
        tickers = "-".join(analyses.keys())
        cache_key = f"rank_companies_{industry}_{tickers}"
        cached_result = await self.cache_service.get(cache_key)
        if cached_result:
            print("CACHE HIT", cache_key)
            return cached_result

        try:
            system_prompt = f"You are a financial analyst providing a ranking of companies in the {industry} industry based on their investment potential. Be discerning and sharp. Truly think about whether a stock is valuable or not. You are a skeptical investor. Return output in proper markdown."
            analysis_text = "\n\n".join(
                f"Ticker: {ticker}\nCurrent Price: {prices.get(ticker, 'N/A')}\nAnalysis:\n{analysis}"
                for ticker, analysis in analyses.items()
            )
            input_text = f"Industry: {industry}\n\n Company Analyses:\n{analysis_text}\n\nBased on the provided analyses, please rank the companies from most attractive to least attractive for investment. Provide a brief rationale for your ranking. In each rationale, include the current price (if available) and a price target. return output in proper markdown. \n\n RANKING:"

            response = await self.llm_service.generate_text(system_prompt, input_text, max_tokens=500)

            if response != "Unable to retrieve analysis.":
                # Cache for 1 hour
                await self.cache_service.set(cache_key, response, expiration=3600)
            return response

        except:
            result = "Unable to retrieve analysis."
            # Cache for 1 hour
            await self.cache_service.set(cache_key, result, expiration=3600)
            return result

    async def get_top_50_sp500_stocks(self):
        try:
            cache_key = "top_50_sp500_stocks"
            cached_result = await self.cache_service.get(cache_key)
            if cached_result:
                return json.loads(cached_result)

            symbols = self._get_sp500_symbols()

            with ThreadPoolExecutor(max_workers=2) as executor:
                futures = [executor.submit(
                    self._get_stock_info, symbol) for symbol in symbols]
                results = [future.result() for future in as_completed(futures)]

            df = pd.DataFrame(results)
            df_sorted = df.sort_values('Market Cap', ascending=False)
            top_50 = df_sorted.head(50)

            top_50['Market Cap'] = top_50['Market Cap'].apply(
                lambda x: f"${x/1e9:.2f}B")
            top_50['Price'] = top_50['Price'].apply(lambda x: f"${x:.2f}")
            top_50['Change'] = top_50['Change'].apply(lambda x: f"{x:.2f}%")
            top_50['Volume'] = top_50['Volume'].apply(lambda x: f"{x:,}")

            result = top_50.to_dict('records')
            if result:
                await self.cache_service.set(cache_key, json.dumps(result), expiration=1800)
            return result
        except Exception as e:
            logging.error(f"Error in get_top_50_sp500_stocks: {str(e)}")
            return {"error": "An error occurred while fetching top 50 S&P 500 stocks"}

    def _get_sp500_symbols(self):
        if os.path.exists(self.CACHE_FILE):
            cache_time = datetime.fromtimestamp(
                os.path.getmtime(self.CACHE_FILE))
            if (datetime.now() - cache_time).days < self.CACHE_EXPIRY_DAYS:
                return pd.read_csv(self.CACHE_FILE)['Symbol'].tolist()

        sp500 = pd.read_html(
            'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')[0]
        sp500.to_csv(self.CACHE_FILE, index=False)
        return sp500['Symbol'].tolist()

    def _get_stock_info(self, symbol):
        stock = yf.Ticker(symbol)
        info = stock.info
        return {
            'Symbol': symbol,
            'Name': info.get('longName', 'N/A'),
            'Market Cap': info.get('marketCap', 0),
            'Price': info.get('currentPrice', 0),
            'Change': info.get('regularMarketChangePercent', 0),
            'Volume': info.get('volume', 0)
        }
