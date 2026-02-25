// Netlify serverless function — reads Telegraph survey responses from HubSpot
// No npm dependencies — uses Node.js built-in fetch

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
const HUBSPOT_API = "https://api.hubapi.com";

const SURVEY_PROPERTIES = [
  "telegraph_impact",
  "telegraph_impact_feedback",
  "telegraph_support",
  "telegraph_support_feedback",
  "telegraph_csat",
  "telegraph_csat_feedback",
  "telegraph_referral",
  "telegraph_g2_review",
];

const CONTACT_PROPERTIES = [
  "email",
  "firstname",
  "lastname",
  "company",
  "createdate",
  ...SURVEY_PROPERTIES,
];

async function fetchAllContacts() {
  const contacts = [];
  let after = undefined;

  while (true) {
    const body = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "telegraph_csat",
              operator: "HAS_PROPERTY",
            },
          ],
        },
      ],
      properties: CONTACT_PROPERTIES,
      limit: 100,
    };

    if (after) {
      body.after = after;
    }

    const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HubSpot API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    contacts.push(...data.results);

    // Check for next page
    if (data.paging && data.paging.next && data.paging.next.after) {
      after = data.paging.next.after;
    } else {
      break;
    }
  }

  return contacts;
}

function formatContact(contact) {
  const p = contact.properties || {};
  return {
    id: contact.id,
    email: p.email || null,
    firstname: p.firstname || null,
    lastname: p.lastname || null,
    company: p.company || null,
    createdate: p.createdate || null,
    telegraph_impact: p.telegraph_impact || null,
    telegraph_impact_feedback: p.telegraph_impact_feedback || null,
    telegraph_support: p.telegraph_support || null,
    telegraph_support_feedback: p.telegraph_support_feedback || null,
    telegraph_csat: p.telegraph_csat || null,
    telegraph_csat_feedback: p.telegraph_csat_feedback || null,
    telegraph_referral: p.telegraph_referral || null,
    telegraph_g2_review: p.telegraph_g2_review || null,
  };
}

export async function handler(event) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const rawContacts = await fetchAllContacts();
    const contacts = rawContacts.map(formatContact);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: contacts.length,
        contacts,
        fetchedAt: new Date().toISOString(),
      }),
    };
  } catch (err) {
    console.error("Error fetching survey results:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: err.message,
      }),
    };
  }
}
