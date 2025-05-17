from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'limited_app')]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


class FundType(str, Enum):
    VENTURE = "Venture Fund"
    DEMO_DAY = "Demo Day Fund"
    GROWTH = "Growth Fund"
    EARLY_GROWTH = "Early Growth Fund"


class Round(str, Enum):
    PRE_SEED = "Pre-Seed"
    SEED = "Seed"
    SEED_PLUS = "Seed+"
    SERIES_A = "Series A"
    SERIES_A_PLUS = "Series A+"
    LATE_STAGE = "Late Stage"


class Sector(str, Enum):
    FINTECH = "FinTech"
    AI_ML = "AI/ML"
    ENTERPRISE = "Enterprise Software"
    CONSUMER = "Consumer Products"
    BLOCKCHAIN = "Blockchain/Crypto"
    AEROSPACE = "Aerospace"
    ROBOTICS = "Robotics"
    FITNESS = "Fitness"
    SOCIAL = "Social"
    MEDIA = "Media/Entertainment"
    INVESTMENT = "Investment Platform"
    COLLABORATION = "Collaboration Tools"


# Define Models
class Fund(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    symbol: str
    description: Optional[str] = None
    min_investment: int
    carry: str  # "20%" or "20-30%"
    management_fee: str  # "2% for 10 years"
    status: str = "Active"
    fund_type: FundType
    gp_name: str
    target_close_date: Optional[datetime] = None
    performance: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Company(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    symbol: str
    lead_investor: str
    co_investors: Optional[List[str]] = None
    sector: Sector
    valuation: str
    round: Round
    traction: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Deal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    company_name: str
    symbol: str
    sector: Sector
    round: Round
    valuation: str
    syndicate: str
    co_investors: Optional[List[str]] = None
    invited_date: datetime
    deadline: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class FundCreate(BaseModel):
    name: str
    symbol: str
    description: Optional[str] = None
    min_investment: int
    carry: str
    management_fee: str
    fund_type: FundType
    gp_name: str
    target_close_date: Optional[datetime] = None
    performance: Optional[str] = None


class CompanyCreate(BaseModel):
    name: str
    symbol: str
    lead_investor: str
    co_investors: Optional[List[str]] = None
    sector: Sector
    valuation: str
    round: Round
    traction: str


class DealCreate(BaseModel):
    company_id: str
    company_name: str
    symbol: str
    sector: Sector
    round: Round
    valuation: str
    syndicate: str
    co_investors: Optional[List[str]] = None
    invited_date: datetime
    deadline: datetime


class FeaturedFund(BaseModel):
    id: str
    name: str
    symbol: str
    min_investment: int
    carry: str
    description: Optional[str] = None
    target_close_date: Optional[datetime] = None
    performance: Optional[str] = None


# Fund Routes
@api_router.post("/funds", response_model=Fund)
async def create_fund(fund: FundCreate):
    fund_dict = fund.dict()
    fund_obj = Fund(**fund_dict)
    result = await db.funds.insert_one(fund_obj.dict())
    created_fund = await db.funds.find_one({"_id": result.inserted_id})
    return Fund(**created_fund)


@api_router.get("/funds", response_model=List[Fund])
async def get_funds():
    funds = await db.funds.find().to_list(1000)
    return [Fund(**fund) for fund in funds]


@api_router.get("/funds/{fund_id}", response_model=Fund)
async def get_fund(fund_id: str):
    fund = await db.funds.find_one({"id": fund_id})
    if not fund:
        raise HTTPException(status_code=404, detail="Fund not found")
    return Fund(**fund)


# Company Routes
@api_router.post("/companies", response_model=Company)
async def create_company(company: CompanyCreate):
    company_dict = company.dict()
    company_obj = Company(**company_dict)
    result = await db.companies.insert_one(company_obj.dict())
    created_company = await db.companies.find_one({"_id": result.inserted_id})
    return Company(**created_company)


@api_router.get("/companies", response_model=List[Company])
async def get_companies():
    companies = await db.companies.find().to_list(1000)
    return [Company(**company) for company in companies]


@api_router.get("/companies/{company_id}", response_model=Company)
async def get_company(company_id: str):
    company = await db.companies.find_one({"id": company_id})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return Company(**company)


# Deal Routes
@api_router.post("/deals", response_model=Deal)
async def create_deal(deal: DealCreate):
    deal_dict = deal.dict()
    deal_obj = Deal(**deal_dict)
    result = await db.deals.insert_one(deal_obj.dict())
    created_deal = await db.deals.find_one({"_id": result.inserted_id})
    return Deal(**created_deal)


@api_router.get("/deals", response_model=List[Deal])
async def get_deals():
    deals = await db.deals.find().to_list(1000)
    return [Deal(**deal) for deal in deals]


@api_router.get("/deals/{deal_id}", response_model=Deal)
async def get_deal(deal_id: str):
    deal = await db.deals.find_one({"id": deal_id})
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return Deal(**deal)


# Featured Items API
@api_router.get("/featured")
async def get_featured_items():
    """Get featured funds and deals for the homepage"""
    # Featured Funds
    featured_funds = await db.funds.find().limit(3).to_list(3)
    featured_funds = [
        {
            "id": fund["id"],
            "name": fund["name"],
            "symbol": fund["symbol"],
            "min_investment": fund["min_investment"],
            "carry": fund["carry"],
            "description": fund.get("description"),
            "target_close_date": fund.get("target_close_date"),
            "performance": fund.get("performance"),
            "fund_type": fund.get("fund_type")
        }
        for fund in featured_funds
    ]
    
    # All Funds
    all_funds = await db.funds.find().to_list(50)
    all_funds = [
        {
            "id": fund["id"],
            "name": fund["name"],
            "symbol": fund["symbol"],
            "min_investment": fund["min_investment"],
            "carry": fund["carry"],
            "gp_name": fund.get("gp_name"),
            "management_fee": fund.get("management_fee"),
            "status": fund.get("status", "Active"),
            "fund_type": fund.get("fund_type")
        }
        for fund in all_funds
    ]
    
    # All Companies
    all_companies = await db.companies.find().to_list(50)
    all_companies = [
        {
            "id": company["id"],
            "name": company["name"],
            "symbol": company["symbol"],
            "lead_investor": company["lead_investor"],
            "co_investors": company.get("co_investors", []),
            "sector": company["sector"],
            "valuation": company["valuation"],
            "round": company["round"],
            "traction": company["traction"]
        }
        for company in all_companies
    ]
    
    # All Deals
    all_deals = await db.deals.find().to_list(50)
    all_deals = [
        {
            "id": deal["id"],
            "company_name": deal["company_name"],
            "symbol": deal["symbol"],
            "sector": deal["sector"],
            "round": deal["round"],
            "valuation": deal["valuation"],
            "syndicate": deal["syndicate"],
            "co_investors": deal.get("co_investors", []),
            "invited_date": deal["invited_date"],
            "deadline": deal["deadline"]
        }
        for deal in all_deals
    ]
    
    return {
        "featured_funds": featured_funds,
        "all_funds": all_funds,
        "all_companies": all_companies,
        "all_deals": all_deals
    }


# Seed initial data if none exists
@app.on_event("startup")
async def seed_initial_data():
    # Check if we already have data
    fund_count = await db.funds.count_documents({})
    company_count = await db.companies.count_documents({})
    deal_count = await db.deals.count_documents({})
    
    if fund_count == 0:
        # Seed Demo Day Funds
        demo_day_funds = [
            {
                "id": str(uuid.uuid4()),
                "name": "Demo Day Funds: Y Combinator W25 Batch",
                "symbol": "Y",
                "description": "Top performing companies from the YC W25 batch",
                "min_investment": 10000,
                "carry": "20%",
                "management_fee": "2% for 10 years",
                "status": "Active",
                "fund_type": FundType.DEMO_DAY,
                "gp_name": "Y Combinator",
                "performance": "87% of batches have achieved top decile performance",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "137 Ventures Fund V",
                "symbol": "137", 
                "description": "Secondary investments in late-stage private companies",
                "min_investment": 150000,
                "carry": "20%",
                "management_fee": "2% for 10 years",
                "status": "Active",
                "fund_type": FundType.VENTURE,
                "gp_name": "137 Ventures",
                "target_close_date": datetime(2025, 6, 30),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Anansi",
                "symbol": "AN",
                "description": "Focused on emerging markets in Southeast Asia",
                "min_investment": 10000,
                "carry": "20-30%",
                "management_fee": "2% for 10 years",
                "status": "Active",
                "fund_type": FundType.VENTURE,
                "gp_name": "Vinay Iyengar",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Xseed Fund",
                "symbol": "XS",
                "description": "Specializing in B2B enterprise software",
                "min_investment": 1000000,
                "carry": "20%",
                "management_fee": "2% for 10 years",
                "status": "Active",
                "fund_type": FundType.VENTURE,
                "gp_name": "Xseed Capital",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Sancus Ventures Fund II",
                "symbol": "SV",
                "description": "AI and machine learning focused investments",
                "min_investment": 1000000,
                "carry": "20%",
                "management_fee": "2% for 10 years",
                "status": "Active",
                "fund_type": FundType.VENTURE,
                "gp_name": "Lake Dai",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
        ]
        await db.funds.insert_many(demo_day_funds)
    
    if company_count == 0:
        # Seed Companies
        companies = [
            {
                "id": str(uuid.uuid4()),
                "name": "Runway",
                "symbol": "RW",
                "lead_investor": "Zachary Ginsburg",
                "co_investors": [],
                "sector": Sector.FINTECH,
                "valuation": "$50M",
                "round": Round.SERIES_A,
                "traction": "10K+ users",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Spokn",
                "symbol": "SP",
                "lead_investor": "Unpopular Ventures",
                "co_investors": [],
                "sector": Sector.COLLABORATION,
                "valuation": "$20M",
                "round": Round.SEED_PLUS,
                "traction": "Growing user base",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Rise Studio",
                "symbol": "RS",
                "lead_investor": "Unpopular Ventures",
                "co_investors": [],
                "sector": Sector.BLOCKCHAIN,
                "valuation": "$5M",
                "round": Round.PRE_SEED,
                "traction": "Early traction",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "iCapital Network",
                "symbol": "IC",
                "lead_investor": "Riverside Ventures",
                "co_investors": [],
                "sector": Sector.INVESTMENT,
                "valuation": "$6.08B",
                "round": Round.LATE_STAGE,
                "traction": "Market leader",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "FormityAI",
                "symbol": "FAI",
                "lead_investor": "Mana Ventures",
                "co_investors": ["Heal Capital"],
                "sector": Sector.AI_ML,
                "valuation": "$8M",
                "round": Round.SEED,
                "traction": "Beta launch",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
        ]
        await db.companies.insert_many(companies)
    
    if deal_count == 0:
        # Seed Deals
        deals = [
            {
                "id": str(uuid.uuid4()),
                "company_id": companies[0]["id"],
                "company_name": "Airwal",
                "symbol": "AIR",
                "sector": Sector.AEROSPACE,
                "round": Round.SEED,
                "valuation": "$8.5M",
                "syndicate": "Flight VC Syndicate",
                "co_investors": ["Unlock VC"],
                "invited_date": datetime(2025, 2, 26),
                "deadline": datetime(2025, 3, 18),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "company_id": companies[1]["id"],
                "company_name": "Texas Ranchers Major League Pickleball Team",
                "symbol": "TRMLP",
                "sector": Sector.MEDIA,
                "round": Round.SERIES_A,
                "valuation": "$23M",
                "syndicate": "Red Beard Ventures",
                "co_investors": [],
                "invited_date": datetime(2025, 2, 25),
                "deadline": datetime(2025, 3, 27),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "company_id": companies[2]["id"],
                "company_name": "Mobot",
                "symbol": "MB",
                "sector": Sector.ROBOTICS,
                "round": Round.SERIES_A_PLUS,
                "valuation": "$47M",
                "syndicate": "Red Beard Ventures",
                "co_investors": ["Uncorrelated"],
                "invited_date": datetime(2025, 2, 24),
                "deadline": datetime(2025, 3, 10),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "company_id": companies[3]["id"],
                "company_name": "Light",
                "symbol": "LHT",
                "sector": Sector.CONSUMER,
                "round": Round.SERIES_A,
                "valuation": "$80M",
                "syndicate": "Unwritten Capital",
                "co_investors": ["Shrug Capital"],
                "invited_date": datetime(2025, 2, 23),
                "deadline": datetime(2025, 3, 5),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "company_id": companies[4]["id"],
                "company_name": "Hangout FM",
                "symbol": "HFM",
                "sector": Sector.SOCIAL,
                "round": Round.SEED_PLUS,
                "valuation": "$30M",
                "syndicate": "Riverside Ventures",
                "co_investors": ["Founders Fund"],
                "invited_date": datetime(2025, 2, 23),
                "deadline": datetime(2025, 3, 5),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
        ]
        await db.deals.insert_many(deals)


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Welcome to the Limited API"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
