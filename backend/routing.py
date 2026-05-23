from __future__ import annotations

from typing import Any

LAWYER_DIRECTORY: dict[str, dict[str, list[dict[str, Any]]]] = {
    "Kolkata": {
        "consumer": [
            {
                "name": "Adv. Anirban Mukherjee",
                "phone": "+91 98310 48219",
                "email": "anirban.mukherjee@eastbridgelegal.com",
                "experience_years": 12,
                "rating": 4.6,
                "languages": ["Bengali", "English", "Hindi"],
                "free_consultation": True,
                "specialization": "Consumer disputes, e-commerce fraud, service deficiency",
            },
            {
                "name": "Adv. Riya Chatterjee",
                "phone": "+91 98741 90573",
                "email": "riya.chatterjee@howrahchambers.com",
                "experience_years": 8,
                "rating": 4.4,
                "languages": ["Bengali", "English"],
                "free_consultation": False,
                "specialization": "Consumer Forum filings, warranty claims, medical negligence (consumer)",
            },
        ],
        "criminal": [
            {
                "name": "Adv. Souvik Banerjee",
                "phone": "+91 99033 11762",
                "email": "souvik.banerjee@calcutta-crimlaw.com",
                "experience_years": 15,
                "rating": 4.7,
                "languages": ["Bengali", "English", "Hindi"],
                "free_consultation": False,
                "specialization": "BNS offences, cyber fraud, bail and trial strategy",
            },
            {
                "name": "Adv. Priyanka Dutta",
                "phone": "+91 90070 66391",
                "email": "priyanka.dutta@citydefencelaw.in",
                "experience_years": 10,
                "rating": 4.5,
                "languages": ["Bengali", "English", "Hindi"],
                "free_consultation": True,
                "specialization": "Women safety matters, harassment, protection orders coordination",
            },
            {
                "name": "Adv. Arijit Sen",
                "phone": "+91 98302 74118",
                "email": "arijit.sen@senandpartners.in",
                "experience_years": 18,
                "rating": 4.8,
                "languages": ["Bengali", "English"],
                "free_consultation": False,
                "specialization": "Serious offences, sessions court practice, cross-examination",
            },
        ],
        "property/civil": [
            {
                "name": "Adv. Soumya Roy",
                "phone": "+91 98318 20964",
                "email": "soumya.roy@roycivilchambers.com",
                "experience_years": 14,
                "rating": 4.6,
                "languages": ["Bengali", "English", "Hindi"],
                "free_consultation": True,
                "specialization": "Tenancy disputes, property injunctions, title verification",
            },
            {
                "name": "Adv. Kunal Ghosh",
                "phone": "+91 97482 55031",
                "email": "kunal.ghosh@ghoshlegal.in",
                "experience_years": 9,
                "rating": 4.3,
                "languages": ["Bengali", "English"],
                "free_consultation": False,
                "specialization": "Rent agreements, security deposit recovery, civil suits",
            },
        ],
    },
    "Mumbai": {
        "consumer": [
            {
                "name": "Adv. Neha Deshmukh",
                "phone": "+91 98205 77124",
                "email": "neha.deshmukh@harbourlaw.in",
                "experience_years": 11,
                "rating": 4.5,
                "languages": ["Marathi", "Hindi", "English"],
                "free_consultation": True,
                "specialization": "Consumer disputes, banking/credit card complaints, eDaakhil filings",
            },
            {
                "name": "Adv. Rohan Mehta",
                "phone": "+91 97694 33810",
                "email": "rohan.mehta@mehtaassociates.co.in",
                "experience_years": 16,
                "rating": 4.7,
                "languages": ["Hindi", "English", "Gujarati", "Marathi"],
                "free_consultation": False,
                "specialization": "Large ticket consumer claims, real estate consumer litigation",
            },
        ],
        "criminal": [
            {
                "name": "Adv. Farhan Shaikh",
                "phone": "+91 98922 18403",
                "email": "farhan.shaikh@metrodefence.com",
                "experience_years": 13,
                "rating": 4.6,
                "languages": ["Hindi", "English", "Marathi"],
                "free_consultation": False,
                "specialization": "Cybercrime, fraud complaints, anticipatory bail",
            },
            {
                "name": "Adv. Kavya Iyer",
                "phone": "+91 90049 66211",
                "email": "kavya.iyer@iyerlegalchambers.in",
                "experience_years": 9,
                "rating": 4.4,
                "languages": ["English", "Hindi", "Marathi", "Tamil"],
                "free_consultation": True,
                "specialization": "Harassment, stalking, women safety matters, police liaison",
            },
            {
                "name": "Adv. Sameer Kulkarni",
                "phone": "+91 98197 53018",
                "email": "sameer.kulkarni@kulkarni-criminal.com",
                "experience_years": 20,
                "rating": 4.8,
                "languages": ["Marathi", "Hindi", "English"],
                "free_consultation": False,
                "specialization": "Sessions court trials, serious offences, evidence strategy",
            },
        ],
        "property/civil": [
            {
                "name": "Adv. Pooja Nair",
                "phone": "+91 99203 41670",
                "email": "pooja.nair@coastalcivil.in",
                "experience_years": 12,
                "rating": 4.5,
                "languages": ["English", "Hindi", "Marathi", "Malayalam"],
                "free_consultation": True,
                "specialization": "Landlord-tenant, rent control, property documentation",
            },
            {
                "name": "Adv. Arvind Patel",
                "phone": "+91 98212 90433",
                "email": "arvind.patel@patellegal.co.in",
                "experience_years": 17,
                "rating": 4.6,
                "languages": ["Gujarati", "Hindi", "English", "Marathi"],
                "free_consultation": False,
                "specialization": "Civil suits, injunctions, recovery proceedings",
            },
        ],
    },
    "Delhi": {
        "consumer": [
            {
                "name": "Adv. Aakash Singh",
                "phone": "+91 98101 55492",
                "email": "aakash.singh@delhiclaims.in",
                "experience_years": 10,
                "rating": 4.4,
                "languages": ["Hindi", "English"],
                "free_consultation": True,
                "specialization": "Consumer Forum matters, defective goods, insurance disputes",
            },
            {
                "name": "Adv. Meera Khanna",
                "phone": "+91 99990 12844",
                "email": "meera.khanna@khannachambers.com",
                "experience_years": 18,
                "rating": 4.7,
                "languages": ["Hindi", "English", "Punjabi"],
                "free_consultation": False,
                "specialization": "High value consumer litigation, builder-buyer disputes",
            },
        ],
        "criminal": [
            {
                "name": "Adv. Rajat Bhatia",
                "phone": "+91 98711 66230",
                "email": "rajat.bhatia@bhatia-crimlaw.in",
                "experience_years": 14,
                "rating": 4.6,
                "languages": ["Hindi", "English", "Punjabi"],
                "free_consultation": False,
                "specialization": "FIR strategy, cyber fraud, criminal trial practice",
            },
            {
                "name": "Adv. Sana Qureshi",
                "phone": "+91 97119 44018",
                "email": "sana.qureshi@tiscourtsdefence.com",
                "experience_years": 9,
                "rating": 4.4,
                "languages": ["Hindi", "English", "Urdu"],
                "free_consultation": True,
                "specialization": "Bail matters, women safety, harassment/stalking complaints",
            },
            {
                "name": "Adv. Vikram Malhotra",
                "phone": "+91 98111 20377",
                "email": "vikram.malhotra@malhotralaw.in",
                "experience_years": 22,
                "rating": 4.9,
                "languages": ["Hindi", "English"],
                "free_consultation": False,
                "specialization": "Sessions court trials, white-collar crime, evidence handling",
            },
        ],
        "property/civil": [
            {
                "name": "Adv. Nisha Arora",
                "phone": "+91 98990 77102",
                "email": "nisha.arora@arorapropertylaw.com",
                "experience_years": 13,
                "rating": 4.5,
                "languages": ["Hindi", "English", "Punjabi"],
                "free_consultation": True,
                "specialization": "Tenancy, eviction, civil injunctions, property recovery",
            },
            {
                "name": "Adv. Harsh Vardhan",
                "phone": "+91 98108 54021",
                "email": "harsh.vardhan@vardhanlegal.in",
                "experience_years": 16,
                "rating": 4.6,
                "languages": ["Hindi", "English"],
                "free_consultation": False,
                "specialization": "Civil suits, contract disputes, recovery litigation",
            },
        ],
    },
    "Bangalore": {
        "consumer": [
            {
                "name": "Adv. Shreya Rao",
                "phone": "+91 98861 30518",
                "email": "shreya.rao@siliconclaims.in",
                "experience_years": 9,
                "rating": 4.4,
                "languages": ["English", "Kannada", "Hindi"],
                "free_consultation": True,
                "specialization": "E-commerce disputes, service deficiency, consumer complaints",
            },
            {
                "name": "Adv. Karthik Menon",
                "phone": "+91 98450 77211",
                "email": "karthik.menon@menonlegal.co.in",
                "experience_years": 15,
                "rating": 4.7,
                "languages": ["English", "Kannada", "Malayalam"],
                "free_consultation": False,
                "specialization": "Consumer litigation, real estate consumer matters",
            },
        ],
        "criminal": [
            {
                "name": "Adv. Naveen Kumar",
                "phone": "+91 98453 11842",
                "email": "naveen.kumar@bengalurudefence.in",
                "experience_years": 12,
                "rating": 4.5,
                "languages": ["Kannada", "English", "Hindi"],
                "free_consultation": True,
                "specialization": "Cybercrime, fraud, police station representation",
            },
            {
                "name": "Adv. Ayesha Fathima",
                "phone": "+91 99000 46819",
                "email": "ayesha.fathima@fathimalaw.in",
                "experience_years": 10,
                "rating": 4.4,
                "languages": ["English", "Kannada", "Urdu"],
                "free_consultation": False,
                "specialization": "Harassment and intimidation, bail, trial preparation",
            },
        ],
        "property/civil": [
            {
                "name": "Adv. Prakash Hegde",
                "phone": "+91 98451 22034",
                "email": "prakash.hegde@hegdecivil.com",
                "experience_years": 18,
                "rating": 4.6,
                "languages": ["Kannada", "English", "Hindi"],
                "free_consultation": False,
                "specialization": "Civil suits, tenancy disputes, property documentation",
            },
            {
                "name": "Adv. Divya Srinivasan",
                "phone": "+91 98862 90811",
                "email": "divya.srinivasan@sripropertylaw.in",
                "experience_years": 11,
                "rating": 4.5,
                "languages": ["English", "Kannada", "Tamil"],
                "free_consultation": True,
                "specialization": "Rental disputes, security deposit recovery, civil injunctions",
            },
            {
                "name": "Adv. Aditya Joshi",
                "phone": "+91 99018 77302",
                "email": "aditya.joshi@joshiandco.in",
                "experience_years": 14,
                "rating": 4.6,
                "languages": ["English", "Hindi", "Marathi", "Kannada"],
                "free_consultation": False,
                "specialization": "Contract disputes, recovery suits, civil litigation",
            },
        ],
    },
    "Chennai": {
        "consumer": [
            {
                "name": "Adv. Lakshmi Narayanan",
                "phone": "+91 98410 56112",
                "email": "lakshmi.narayanan@marinaclaims.in",
                "experience_years": 14,
                "rating": 4.6,
                "languages": ["Tamil", "English"],
                "free_consultation": True,
                "specialization": "Consumer complaints, banking disputes, warranty claims",
            },
            {
                "name": "Adv. Priya Krishnan",
                "phone": "+91 90030 44198",
                "email": "priya.krishnan@krishnanlegal.co.in",
                "experience_years": 9,
                "rating": 4.4,
                "languages": ["Tamil", "English", "Hindi"],
                "free_consultation": False,
                "specialization": "E-commerce consumer issues, service deficiency, eDaakhil",
            },
        ],
        "criminal": [
            {
                "name": "Adv. Suresh Iyer",
                "phone": "+91 98405 77261",
                "email": "suresh.iyer@iyerdefence.in",
                "experience_years": 19,
                "rating": 4.8,
                "languages": ["Tamil", "English"],
                "free_consultation": False,
                "specialization": "Criminal trials, bail, FIR strategy under BNS/BNSS",
            },
            {
                "name": "Adv. Nandhini Subramaniam",
                "phone": "+91 98840 22915",
                "email": "nandhini.subramaniam@subramaniamlaw.in",
                "experience_years": 11,
                "rating": 4.5,
                "languages": ["Tamil", "English"],
                "free_consultation": True,
                "specialization": "Harassment, stalking, women safety complaints",
            },
        ],
        "property/civil": [
            {
                "name": "Adv. K. Venkatesh",
                "phone": "+91 98402 33140",
                "email": "venkatesh@venkateshchambers.com",
                "experience_years": 21,
                "rating": 4.7,
                "languages": ["Tamil", "English"],
                "free_consultation": False,
                "specialization": "Property disputes, civil suits, injunctions, recovery",
            },
            {
                "name": "Adv. Deepa Raman",
                "phone": "+91 95000 78102",
                "email": "deepa.raman@ramancivil.in",
                "experience_years": 12,
                "rating": 4.5,
                "languages": ["Tamil", "English"],
                "free_consultation": True,
                "specialization": "Tenancy matters, rental disputes, documentation review",
            },
        ],
    },
    "Hyderabad": {
        "consumer": [
            {
                "name": "Adv. Harika Reddy",
                "phone": "+91 98490 66211",
                "email": "harika.reddy@deccanclaims.in",
                "experience_years": 10,
                "rating": 4.4,
                "languages": ["Telugu", "English", "Hindi"],
                "free_consultation": True,
                "specialization": "Consumer Forum practice, service deficiency, eDaakhil assistance",
            },
            {
                "name": "Adv. Arjun Rao",
                "phone": "+91 99633 11840",
                "email": "arjun.rao@raolegal.co.in",
                "experience_years": 16,
                "rating": 4.6,
                "languages": ["Telugu", "English", "Hindi"],
                "free_consultation": False,
                "specialization": "High value consumer disputes, real estate consumer matters",
            },
        ],
        "criminal": [
            {
                "name": "Adv. Imran Khan",
                "phone": "+91 98495 44012",
                "email": "imran.khan@citydefence.in",
                "experience_years": 13,
                "rating": 4.5,
                "languages": ["Urdu", "Telugu", "English", "Hindi"],
                "free_consultation": False,
                "specialization": "Cybercrime, fraud complaints, bail applications",
            },
            {
                "name": "Adv. S. S. Prasad",
                "phone": "+91 93910 22881",
                "email": "ss.prasad@prasadandpartners.in",
                "experience_years": 20,
                "rating": 4.8,
                "languages": ["Telugu", "English"],
                "free_consultation": False,
                "specialization": "Sessions court trials, serious offences, evidence strategy",
            },
        ],
        "property/civil": [
            {
                "name": "Adv. Anjali Varma",
                "phone": "+91 97013 66205",
                "email": "anjali.varma@varmacivil.in",
                "experience_years": 12,
                "rating": 4.5,
                "languages": ["Telugu", "English", "Hindi"],
                "free_consultation": True,
                "specialization": "Tenancy disputes, recovery suits, civil injunctions",
            },
            {
                "name": "Adv. Ravi Teja",
                "phone": "+91 98486 11992",
                "email": "ravi.teja@tejalaw.in",
                "experience_years": 15,
                "rating": 4.6,
                "languages": ["Telugu", "English"],
                "free_consultation": False,
                "specialization": "Property documentation, civil litigation, title disputes",
            },
        ],
    },
}

PREMIUM_FIRMS: list[dict[str, Any]] = [
    {
        "name": "Khaitan & Co",
        "phone": "+91 22 6636 5000",
        "email": "contact@khaitanco.com",
        "website": "https://www.khaitanco.com",
        "specialization": ["M&A", "Corporate", "Complex Civil"],
    },
    {
        "name": "Cyril Amarchand Mangaldas",
        "phone": "+91 22 2496 4455",
        "email": "contactus@cyrilshroff.com",
        "website": "https://www.cyrilshroff.com",
        "specialization": ["Commercial", "Securities"],
    },
    {
        "name": "Shardul Amarchand Mangaldas",
        "phone": "+91 11 4159 0700",
        "email": "delhi@shardul.com",
        "website": "https://www.shardul.com",
        "specialization": ["Litigation", "Arbitration"],
    },
]


_CITY_ALIASES: dict[str, str] = {
    "calcutta": "Kolkata",
    "howrah": "Kolkata",
    "salt lake": "Kolkata",
    "new town": "Kolkata",
    "navi mumbai": "Mumbai",
    "thane": "Mumbai",
    "gurgaon": "Delhi",
    "gurugram": "Delhi",
    "noida": "Delhi",
    "ghaziabad": "Delhi",
    "faridabad": "Delhi",
    "bengaluru": "Bangalore",
    "madras": "Chennai",
    "secunderabad": "Hyderabad",
}


def _normalize_city(city: str) -> str:
    raw = (city or "").strip()
    if not raw:
        return "Delhi"
    if raw in LAWYER_DIRECTORY:
        return raw
    key = raw.lower()
    if key in _CITY_ALIASES:
        return _CITY_ALIASES[key]
    for known in LAWYER_DIRECTORY.keys():
        if key == known.lower():
            return known
    for known in LAWYER_DIRECTORY.keys():
        if key in known.lower() or known.lower() in key:
            return known
    return "Delhi"


def _normalize_case_type(case_type: str) -> str:
    ct = (case_type or "").strip().lower()
    if ct in {"consumer", "criminal", "property/civil"}:
        return ct
    if ct in {"property", "civil", "property civil", "property dispute", "tenancy"}:
        return "property/civil"
    if ct in {"fraud", "cyber", "scam", "theft", "assault", "harassment"}:
        return "criminal"
    return "consumer"


def _resources_for(case_type: str) -> list[dict[str, str]]:
    ct = _normalize_case_type(case_type)
    base = [
        {
            "name": "eCourts Services",
            "url": "https://ecourts.gov.in/ecourts_home/",
            "description": "Check case status, cause lists, and orders for courts across India.",
        },
        {
            "name": "PGPortal (CPGRAMS)",
            "url": "https://pgportal.gov.in/",
            "description": "File public grievances to Central Government ministries and departments.",
        },
    ]
    if ct == "consumer":
        base.insert(
            0,
            {
                "name": "eDaakhil",
                "url": "https://edaakhil.nic.in/",
                "description": "Online filing portal for consumer complaints in District/State/National Commissions.",
            },
        )
    return base


def get_recommendations(city: str, case_type: str, complexity_score: int) -> dict[str, Any]:
    normalized_city = _normalize_city(city)
    normalized_case_type = _normalize_case_type(case_type)
    score = int(complexity_score)
    score = max(1, min(score, 10))

    resources = _resources_for(normalized_case_type)

    if score >= 8:
        return {
            "tier": "premium",
            "recommendations": PREMIUM_FIRMS,
            "self_help_resources": resources,
        }

    local = LAWYER_DIRECTORY.get(normalized_city, {})
    candidates = list(local.get(normalized_case_type, []))
    candidates_sorted = sorted(candidates, key=lambda x: (float(x.get("rating", 0.0)), int(x.get("experience_years", 0))), reverse=True)

    if score >= 5:
        return {
            "tier": "specialist_local",
            "recommendations": candidates_sorted[:2],
            "self_help_resources": resources,
        }

    self_filing_guide = {
        "name": "Self-filing guide",
        "url": "https://ecourts.gov.in/ecourts_home/",
        "description": "Prepare a concise chronology, preserve evidence (screenshots, invoices, chats), and file on the appropriate portal/court. Keep acknowledgement numbers and follow up in writing.",
    }

    return {
        "tier": "self_help",
        "recommendations": candidates_sorted[:1],
        "self_help_resources": resources + [self_filing_guide],
    }
