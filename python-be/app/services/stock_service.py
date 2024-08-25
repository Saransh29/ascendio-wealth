import yfinance as yf
from datetime import datetime, timedelta
from .llm_service import LLMService
from .cache_service import CacheService
from ..utils.helpers import get_article_text
import ast
import json
import logging
import asyncio

class StockService:
    def __init__(self):
        self.llm_service = LLMService()
        self.cache_service = CacheService()

    async def analyze_industry(self, industry):
        try:
            cache_key = f"analyze_industry_{industry}"
            print("HERE industry",industry)
            # cached_result = await self.cache_service.get(cache_key)
            # print("CACHE", cached_result)
            # if cached_result:
            #     return json.loads(cached_result)

            tickers = await self.generate_ticker_ideas(industry)
            print("TICKERS",tickers)
            analyses = {}
            prices = {}
            industry_analsyis = {}

            async def analyze_ticker(ticker):
                analysis = await self.analyze_stock(ticker)
                if analysis is None:
                    raise ValueError(f"Analysis for ticker {ticker} returned None")
                return ticker, analysis['final_analysis'], analysis['price'], analysis

            tasks = [analyze_ticker(ticker) for ticker in tickers]
            results = await asyncio.gather(*tasks)

            for ticker, final_analysis, price, analysis in results:
                if ticker not in industry_analsyis:
                    industry_analsyis['ticker'] = analysis
                analyses[ticker] = final_analysis
                prices[ticker] = price


            ranking = await self.rank_companies(industry, analyses, prices)
            result = {"tickers": tickers, "analyses": analyses, "ranking": ranking, industry_analsyis: industry_analsyis}
            
            # await self.cache_service.set(cache_key, result, expiration=3600)  # Cache for 1 hour
            return result
        except Exception as e:
            logging.error(f"Error in analyze_industry: {str(e)}")
            return {"error": "An error occurred while analyzing the industry"}

    async def analyze_stock(self, ticker):
        try:
            cache_key = f"analyze_stock_{ticker}"
            # cached_result = await self.cache_service.get(cache_key)
            # if cached_result:
            #     return json.loads(cached_result)
            print("============================================")
            print("Analysing TICKER:",ticker)

            hist_data, balance_sheet, financials, news = await self.get_stock_data(ticker, 1)

            sentiment_task = self.get_sentiment_analysis(ticker, news)
            analyst_ratings_task = self.get_analyst_ratings(ticker)
            industry_analysis_task = self.get_industry_analysis(ticker)

            sentiment_analysis, analyst_ratings, industry_analysis = await asyncio.gather(
                sentiment_task, analyst_ratings_task, industry_analysis_task
            )

            # print("-------")
            # print("SENTIMENT analysis:", sentiment_analysis)
            # print("-------")
            # print("analyst_ratings:", analyst_ratings)
            # print("-------")
            # print("industry_analysis", industry_analysis)
            # print("-------")
            # print("industry_analysis",industry_analysis)

            final_analysis = await self.get_final_analysis(ticker, {}, sentiment_analysis, analyst_ratings, industry_analysis)

            # print("-------")
            # print("final_analysis",final_analysis)

            price = await self.get_current_price(ticker)

            print("============================================")
            result = {
                "sentiment_analysis": sentiment_analysis,
                "analyst_ratings": analyst_ratings,
                "industry_analysis": industry_analysis,
                "final_analysis": final_analysis,
                "price": float(price)  # Convert numpy.float64 to float
            }

            # TODO: FIX THIS
            # await self.cache_service.set(cache_key, json.dumps(result), expiration=1800)  # Cache for 30 minutes
            return result
        except Exception as e:
            logging.error(f"Error in analyze_stock for {ticker}: {str(e)}")
            return {"error": f"An error occurred while analyzing {ticker}"}

    async def get_stock_data(self, ticker, years):
        try:
            cache_key = f"stock_data_{ticker}_{years}"
            # cached_result = await self.cache_service.get(cache_key)
            # if cached_result:
            #     return json.loads(cached_result)

            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=years*365)

            stock = yf.Ticker(ticker)

            hist_data = stock.history(start=start_date, end=end_date)
            balance_sheet = stock.balance_sheet
            financials = stock.financials
            news = stock.news

            # result = hist_data, balance_sheet, financials, news
            # await self.cache_service.set(cache_key, json.dumps(result), expiration=3600)  # Cache for 1 hour
            
            return hist_data, balance_sheet, financials, news
        except Exception as e:
            logging.error(f"Error in get_stock_data for {ticker}: {str(e)}")
            return None

    async def generate_ticker_ideas(self, industry):
        try:
            cache_key = f"ticker_ideas_{industry}"
            cached_result = await self.cache_service.get(cache_key)
            if cached_result:
                return json.loads(cached_result)

            system_prompt = f"You are a financial assistant. You carefully follow instructions. Don't return markdown. Don't return backticks. Don't return any code, just return a python-parseable list. "
            input_text = f"Please provide a list of 5 ticker symbols for major companies in the {industry} industry as a Python-parseable list. Only respond with the list, no other text. "

            response = await self.llm_service.generate_text(system_prompt, input_text)
            ticker_list = ast.literal_eval(response)
            result = [ticker.strip() for ticker in ticker_list]

            await self.cache_service.set(cache_key, json.dumps(result), expiration=86400)  # Cache for 24 hours
            return result
        except Exception as e:
            logging.error(f"Error in generate_ticker_ideas for {industry}: {str(e)}")
            return []

    async def get_sentiment_analysis(self, ticker, news):
        try:
            cache_key = f"sentiment_analysis_{ticker}"
            cached_result = await self.cache_service.get(cache_key)
            if cached_result:
                return cached_result.decode('utf-8')

            system_prompt = f"You are a sentiment analysis assistant. Analyze the sentiment of the given news articles for {ticker} and provide a summary of the overall sentiment and any notable changes over time. Be measured and discerning. You are a skeptical investor."
          
            news_text = ""
            for article in news:
                print(f"analyzing article {article['title']}")
                article_text = get_article_text(article['link'])
                timestamp = datetime.fromtimestamp(
                    article['providerPublishTime']).strftime("%Y-%m-%d")
                news_text += f"\n\n---\n\nDate: {timestamp}\nTitle: {article['title']}\nText: {article_text}"

            input_text = f"News articles for {ticker}:\n{news_text}\n\n----\n\nProvide a summary of the overall sentiment and any notable changes over time."

            response = await self.llm_service.generate_text(system_prompt, input_text, max_tokens=350)

            await self.cache_service.set(cache_key, response, expiration=3600)  # Cache for 1 hour
            return response
        except Exception as e:
            logging.error(f"Error in get_sentiment_analysis for {ticker}: {str(e)}")
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

        await self.cache_service.set(cache_key, result, expiration=3600)  # Cache for 1 hour
        return result

    async def get_industry_analysis(self, ticker):
        cache_key = f"industry_analysis_{ticker}"
        cached_result = await self.cache_service.get(cache_key)
        if cached_result:
            return cached_result

        try:
            stock = yf.Ticker(ticker)
            industry = stock.info['industry']
            sector = stock.info['sector']

            print(f"industry: {industry}, sector: {sector}")

            system_prompt = f"You are a financial industry analysis assistant. Provide an comprehensive analysis including trends, growth prospects, regulatory changes, and competitive landscape. Be measured and discerning. Truly think about the positives and negatives of the stock. Be sure of your analysis. You are a skeptical investor. You carefully follow instructions. Don't return markdown. Don't return backticks."
            input_text = f"Provide an analysis of the {industry} industry and {sector} sector in max 200 words."

            response = await self.llm_service.generate_text(system_prompt, input_text, max_tokens=200)

            await self.cache_service.set(cache_key, response, expiration=86400)  # Cache for 24 hours
            return response

        except:
            result = "Unable to retrieve industry analysis."
            await self.cache_service.set(cache_key, result, expiration=3600)  # Cache for 1 hour
            return result

    async def get_final_analysis(self, ticker, comparisons, sentiment_analysis, analyst_ratings, industry_analysis):
        cache_key = f"final_analysis_{ticker}"
        cached_result = await self.cache_service.get(cache_key)
        if cached_result:
            return cached_result

        try:
            system_prompt = f"You are a financial analyst providing a final investment recommendation for {ticker} based on the given data and analyses. Be measured and discerning. Truly think about the positives and negatives of the stock. Be sure of your analysis. You are a skeptical investor."
            input_text = f"Ticker: {ticker} \n\n Comparative Analysis:\n{json.dumps(comparisons, indent=2)}\n\n Sentiment Analysis:\n{sentiment_analysis}\ n\nAnalyst Ratings:\n{analyst_ratings}\n\n Industry Analysis:\n{industry_analysis}\n\nBased on the provided data and analyses, please provide a comprehensive investment analysis and recommendation for {ticker}. Consider the company's financial strength, growth prospects, competitive position, and potential risks. Provide a clear and concise recommendation on whether to buy, hold, or sell the stock, along with supporting rationale."

            response = await self.llm_service.generate_text(system_prompt, input_text, max_tokens=400)

            await self.cache_service.set(cache_key, response, expiration=3600)  # Cache for 1 hour
            return response

        except:
            result = "Unable to retrieve analysis."
            await self.cache_service.set(cache_key, result, expiration=3600)  # Cache for 1 hour
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

            await self.cache_service.set(cache_key, result, expiration=60)  # Cache for 1 minute
            return result
        except Exception as e:
            logging.error(f"Error in get_current_price for {ticker}: {str(e)}")
            return None

    async def rank_companies(self, industry, analyses, prices):
        cache_key = f"rank_companies_{industry}"
        # cached_result = await self.cache_service.get(cache_key)
        # if cached_result:
        #     return cached_result

        try:
            system_prompt = f"You are a financial analyst providing a ranking of companies in the {industry} industry based on their investment potential. Be discerning and sharp. Truly think about whether a stock is valuable or not. You are a skeptical investor."
            analysis_text = "\n\n".join(
                f"Ticker: {ticker}\nCurrent Price: {prices.get(ticker, 'N/A')}\nAnalysis:\n{analysis}"
                for ticker, analysis in analyses.items()
            )
            input_text = f"Industry: {industry}\n\n Company Analyses:\n{analysis_text}\n\nBased on the provided analyses, please rank the companies from most attractive to least attractive for investment. Provide a brief rationale for your ranking. In each rationale, include the current price (if available) and a price target."

            response = await self.llm_service.generate_text(system_prompt, input_text, max_tokens=400)

            if response != "Unable to retrieve analysis.":
                await self.cache_service.set(cache_key, response, expiration=3600)  # Cache for 1 hour
            return response

        except:
            result = "Unable to retrieve analysis."
            await self.cache_service.set(cache_key, result, expiration=3600)  # Cache for 1 hour
            return result