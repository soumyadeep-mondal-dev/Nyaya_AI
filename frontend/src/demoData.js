function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export const DEMO_RESULTS = {
  "case-1": {
    grievance:
      "My landlord is refusing to return my security deposit even after I vacated the flat and handed over the keys. He is making false claims about damages and is not providing any itemized bill or proof.",
    location: "Kolkata",
    facts: {
      issue_type: "property",
      parties_involved: ["Tenant (Complainant)", "Landlord"],
      timeline: "Deposit paid at start of tenancy; vacated last month; repeated follow-ups over 2 weeks",
      amount_involved: "₹40,000",
      location_detail: "Residential flat in Kolkata",
      urgency: "medium",
      summary: "Landlord is withholding security deposit after move-out without proof of damages.",
    },
    statutes:
      "1) Civil recovery / tenancy principles (Property/Civil):\n   - Covers return of refundable security deposit and recovery of money.\n   - Strength: strong\n\n2) Wrongful restraint/confinement not applicable here.\n   - Strength: weak\n\n3) If intimidation/harassment occurs during recovery attempts, criminal intimidation provisions may apply.\n   - Strength: moderate (fact-dependent)",
    document:
      "TO,\n[Authority Name]\n[Authority Address]\n\nCOMPLAINT/PETITION\n\nCOMPLAINANT: [Name placeholder]\nDATE: 2026-05-22\n\nSUBJECT: Complaint for refund of security deposit and illegal withholding by landlord\n\nFACTS OF THE CASE:\n1. I, the complainant, was a tenant at the above-mentioned premises and paid a refundable security deposit of ₹40,000 at the start of the tenancy.\n2. I vacated the premises, cleared dues, and handed over keys/possession, but the landlord has refused to return the deposit.\n3. The landlord has made vague allegations of damages and has not provided any itemized statement, invoices, or proof.\n4. Despite repeated requests, the deposit amount has not been refunded.\n\nLEGAL PROVISIONS VIOLATED:\n- Applicable civil law principles relating to recovery of money and tenancy obligations.\n\nRELIEF SOUGHT:\n1. Direction to refund the security deposit of ₹40,000 with applicable interest.\n2. Direction to provide an itemized statement and proof for any deductions.\n3. Any other relief deemed fit.\n\nVERIFICATION:\nI, the complainant, hereby declare that the contents of this complaint are true and correct to the best of my knowledge and belief.\n\n[Signature placeholder]",
    jurisdiction: {
      authority_type: "Civil Court",
      specific_authority: "Civil Judge (Junior Division) / Small Causes (as applicable)",
      next_steps: [
        "1) Send a written legal notice to the landlord demanding refund within 7 days (attach rent agreement and move-out handover proof).",
        "2) Preserve evidence: receipts, bank transfers, WhatsApp/email conversations, handover photos/videos.",
        "3) If no refund, file a recovery suit (money suit) and seek interest and costs.",
        "4) If intimidation/harassment occurs, file a complaint at the nearest police station with proof.",
        "5) Attend hearings and comply with summons; keep a documented chronology.",
      ],
      time_limit: "Typically 3 years for civil recovery from date of cause of action (subject to facts)",
      filing_fee: "Varies by state and claim amount (approx.)",
    },
    routing: {
      complexity_score: 4,
      needs_lawyer: false,
      reason: "This is a straightforward recovery dispute that can often be resolved with notice and structured filing.",
      lawyer_type: "No lawyer needed - self-file",
      estimated_legal_fee: "₹5,000–₹20,000 (if engaging local counsel for drafting/appearance)",
      estimated_resolution_time: "3–9 months (varies by forum and compliance)",
      success_probability: "Medium",
      key_evidence_needed: ["Rent agreement", "Deposit payment proof", "Move-out/hand-over proof", "Chats/emails with landlord"],
    },
    error: "",
  },
  "case-2": {
    grievance:
      "I ordered a phone online and paid in full, but the seller delivered a fake product. The platform is refusing a refund and the seller has stopped responding. I have invoices and chat proof.",
    location: "Delhi",
    facts: {
      issue_type: "fraud",
      parties_involved: ["Buyer (Complainant)", "Online Seller", "E-commerce Platform"],
      timeline: "Order placed this month; delivery received; refund denied within 7 days",
      amount_involved: "₹18,999",
      location_detail: "Delhi",
      urgency: "high",
      summary: "Fake product delivered in online purchase and refund is being denied despite proof.",
    },
    statutes:
      "1) BNS Section 318 — Cheating (IPC 415 equivalent):\n   - Covers deception and dishonest inducement causing wrongful loss.\n   - Strength: strong\n\n2) Consumer Protection Act — Defective goods / unfair trade practice:\n   - Covers deficient service and refund/replacement remedies.\n   - Strength: strong\n\n3) If identity misuse/personation occurred, cheating by personation may apply.\n   - Strength: moderate (fact-dependent)",
    document:
      "TO,\n[Authority Name]\n[Authority Address]\n\nCOMPLAINT/PETITION\n\nCOMPLAINANT: [Name placeholder]\nDATE: 2026-05-22\n\nSUBJECT: Complaint regarding delivery of counterfeit/fake product and denial of refund\n\nFACTS OF THE CASE:\n1. I purchased a mobile phone through an online marketplace and paid the full amount.\n2. The delivered item is counterfeit/fake and does not match the listing description.\n3. I immediately raised a complaint with the platform and requested a refund/replacement.\n4. The seller stopped responding and the platform has denied/refused the refund despite invoices and chat proof.\n\nLEGAL PROVISIONS VIOLATED:\n- BNS provisions relating to cheating (as applicable).\n- Consumer Protection Act provisions relating to defective goods/deficiency in service.\n\nRELIEF SOUGHT:\n1. Direction to refund the full amount.\n2. Direction to take action against the seller/platform for unfair trade practice.\n3. Any other relief deemed fit.\n\nVERIFICATION:\nI, the complainant, hereby declare that the contents of this complaint are true and correct to the best of my knowledge and belief.\n\n[Signature placeholder]",
    jurisdiction: {
      authority_type: "Consumer Forum",
      specific_authority: "District Consumer Disputes Redressal Commission (via eDaakhil)",
      next_steps: [
        "1) Collect evidence: invoice, order ID, packaging photos, unboxing video, chats/emails, refund denial screenshots.",
        "2) Send a written notice to the platform and seller demanding refund/replacement within 7 days.",
        "3) File a consumer complaint on eDaakhil seeking refund + compensation for harassment.",
        "4) If clear deception/fraud, file a complaint at the Cyber Crime/Police Station with all digital proof.",
        "5) Track complaint numbers and attend hearings (online/offline) as scheduled.",
      ],
      time_limit: "Generally 2 years for consumer complaints from cause of action (subject to facts)",
      filing_fee: "Low/nominal for smaller claims (varies by slab and state)",
    },
    routing: {
      complexity_score: 7,
      needs_lawyer: true,
      reason: "Multiple parties (seller + platform) and mixed consumer/criminal remedies make strategy important.",
      lawyer_type: "Specialist lawyer - Consumer & Cyber Fraud",
      estimated_legal_fee: "₹20,000–₹75,000 (depends on claim and forum)",
      estimated_resolution_time: "6–18 months",
      success_probability: "High",
      key_evidence_needed: ["Invoice/order confirmation", "Product photos/unboxing video", "Platform chat/email trail", "Payment proof"],
    },
    error: "",
  },
  "case-3": {
    grievance:
      "My employer has not paid my salary for the last two months despite repeated follow-ups. They are delaying payment without any written reason. I have offer letter, attendance logs, and emails.",
    location: "Bangalore",
    facts: {
      issue_type: "labour",
      parties_involved: ["Employee (Complainant)", "Employer / HR"],
      timeline: "Salary pending for 2 months; reminders sent weekly",
      amount_involved: null,
      location_detail: "Bangalore",
      urgency: "high",
      summary: "Employer has withheld wages for two months despite proof of work and written follow-ups.",
    },
    statutes:
      "1) Labour laws / wage payment obligations (as applicable to establishment):\n   - Covers non-payment/delay of wages and remedies through labour authorities.\n   - Strength: strong\n\n2) If unlawful deductions or coercion involved, additional labour provisions may apply.\n   - Strength: moderate\n\n3) Criminal provisions generally not primary unless there is clear fraud/forgery.\n   - Strength: weak",
    document:
      "TO,\n[Authority Name]\n[Authority Address]\n\nCOMPLAINT/PETITION\n\nCOMPLAINANT: [Name placeholder]\nDATE: 2026-05-22\n\nSUBJECT: Complaint for non-payment of salary/wages for two months by employer\n\nFACTS OF THE CASE:\n1. I am employed with the employer and have been performing my duties as per my offer letter/appointment terms.\n2. The employer has failed to pay my salary for the last two months without any valid written reason.\n3. I have maintained attendance records and have email communications acknowledging pending salary.\n4. Despite repeated follow-ups, payment has not been made.\n\nLEGAL PROVISIONS VIOLATED:\n- Applicable labour and wage payment provisions relevant to the establishment.\n\nRELIEF SOUGHT:\n1. Direction to pay the pending salary with applicable interest.\n2. Direction to issue payslips/settlement statement and comply with statutory obligations.\n3. Any other relief deemed fit.\n\nVERIFICATION:\nI, the complainant, hereby declare that the contents of this complaint are true and correct to the best of my knowledge and belief.\n\n[Signature placeholder]",
    jurisdiction: {
      authority_type: "Labour Court",
      specific_authority: "Office of Labour Commissioner / Labour Department (as applicable)",
      next_steps: [
        "1) Compile proof: offer letter, bank statements, attendance logs, salary slips (if any), email/WhatsApp follow-ups.",
        "2) Send a written demand notice to HR/management requesting payment within 7 days.",
        "3) File a complaint with the local Labour Department / Labour Commissioner for wage recovery.",
        "4) If needed, initiate conciliation and pursue claim before the appropriate labour forum/court.",
        "5) Maintain a written chronology and keep all acknowledgements and complaint IDs.",
      ],
      time_limit: "Varies by statute and forum; file at the earliest (delays can weaken relief in some cases)",
      filing_fee: "Usually minimal/nominal for complaints; varies by forum",
    },
    routing: {
      complexity_score: 6,
      needs_lawyer: true,
      reason: "Wage recovery is strong but procedure and conciliation steps benefit from specialist guidance.",
      lawyer_type: "Specialist lawyer - Labour / Employment",
      estimated_legal_fee: "₹15,000–₹60,000",
      estimated_resolution_time: "3–12 months",
      success_probability: "High",
      key_evidence_needed: ["Offer letter/contract", "Attendance logs", "Emails acknowledging salary due", "Bank statements showing non-payment"],
    },
    error: "",
  },
};

export function getDemoResult({ sampleId, grievance, location }) {
  const normalizedId = sampleId && DEMO_RESULTS[sampleId] ? sampleId : null;
  const text = String(grievance || "").toLowerCase();

  let pick = normalizedId;
  if (!pick) {
    if (text.includes("security deposit") || text.includes("deposit") || text.includes("landlord")) pick = "case-1";
    else if (text.includes("fake") || text.includes("refund") || text.includes("online")) pick = "case-2";
    else if (text.includes("salary") || text.includes("wage") || text.includes("employer")) pick = "case-3";
    else pick = "case-2";
  }

  const base = clone(DEMO_RESULTS[pick]);
  base.__demo = true;
  base.__demo_case_id = pick;
  base.grievance = grievance || base.grievance;
  base.location = location || base.location;
  if (base.facts && typeof base.facts === "object") {
    base.facts.location_detail = location || base.facts.location_detail;
  }
  return base;
}

export const DEMO_LAWYER_RECOMMENDATIONS = {
  "case-1": {
    tier: "self_help",
    recommendations: [
      {
        name: "Adv. Soumya Roy",
        phone: "+91 98318 20964",
        email: "soumya.roy@roycivilchambers.com",
        experience_years: 14,
        rating: 4.6,
        languages: ["Bengali", "English", "Hindi"],
        free_consultation: true,
        specialization: "Tenancy disputes, security deposit recovery, civil notices",
      },
    ],
    self_help_resources: [
      {
        name: "eCourts Services",
        url: "https://ecourts.gov.in/ecourts_home/",
        description: "Check case status, cause lists, and orders for courts across India.",
      },
      {
        name: "PGPortal (CPGRAMS)",
        url: "https://pgportal.gov.in/",
        description: "File public grievances to Central Government ministries and departments.",
      },
    ],
  },
  "case-2": {
    tier: "specialist_local",
    recommendations: [
      {
        name: "Adv. Rajat Bhatia",
        phone: "+91 98711 66230",
        email: "rajat.bhatia@bhatia-crimlaw.in",
        experience_years: 14,
        rating: 4.6,
        languages: ["Hindi", "English", "Punjabi"],
        free_consultation: false,
        specialization: "Cyber fraud, FIR strategy, consumer-criminal overlap",
      },
      {
        name: "Adv. Meera Khanna",
        phone: "+91 99990 12844",
        email: "meera.khanna@khannachambers.com",
        experience_years: 18,
        rating: 4.7,
        languages: ["Hindi", "English", "Punjabi"],
        free_consultation: false,
        specialization: "Consumer forum filings, builder-buyer and e-commerce disputes",
      },
    ],
    self_help_resources: [
      {
        name: "eDaakhil",
        url: "https://edaakhil.nic.in/",
        description: "Online filing portal for consumer complaints in District/State/National Commissions.",
      },
      {
        name: "eCourts Services",
        url: "https://ecourts.gov.in/ecourts_home/",
        description: "Check case status, cause lists, and orders for courts across India.",
      },
      {
        name: "PGPortal (CPGRAMS)",
        url: "https://pgportal.gov.in/",
        description: "File public grievances to Central Government ministries and departments.",
      },
    ],
  },
  "case-3": {
    tier: "specialist_local",
    recommendations: [
      {
        name: "Adv. Karthik Menon",
        phone: "+91 98450 77211",
        email: "karthik.menon@menonlegal.co.in",
        experience_years: 15,
        rating: 4.7,
        languages: ["English", "Kannada", "Malayalam"],
        free_consultation: false,
        specialization: "Employment disputes, wage recovery, conciliation strategy",
      },
      {
        name: "Adv. Aditya Joshi",
        phone: "+91 99018 77302",
        email: "aditya.joshi@joshiandco.in",
        experience_years: 14,
        rating: 4.6,
        languages: ["English", "Hindi", "Marathi", "Kannada"],
        free_consultation: false,
        specialization: "Contract and recovery matters for salary/wage disputes",
      },
    ],
    self_help_resources: [
      {
        name: "eCourts Services",
        url: "https://ecourts.gov.in/ecourts_home/",
        description: "Check case status, cause lists, and orders for courts across India.",
      },
      {
        name: "PGPortal (CPGRAMS)",
        url: "https://pgportal.gov.in/",
        description: "File public grievances to Central Government ministries and departments.",
      },
    ],
  },
};

export function getDemoLawyerRecommendations(caseId) {
  const key = caseId && DEMO_LAWYER_RECOMMENDATIONS[caseId] ? caseId : "case-2";
  return clone(DEMO_LAWYER_RECOMMENDATIONS[key]);
}
