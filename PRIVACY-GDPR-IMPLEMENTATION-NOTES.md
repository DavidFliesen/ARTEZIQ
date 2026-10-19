# ARTEZIQ Privacy / GDPR Implementation Notes

This implementation is designed to be privacy-forward and to support GDPR/UK GDPR/Swiss privacy expectations, but software changes alone cannot guarantee legal compliance. Operational behavior must match the published policy.

## Conservative consent implementation

The site displays the analytics choice to **all visitors**, not only visitors who appear to be in the EEA/UK/Switzerland.

Reason: this is a static GitHub Pages site and does not have a trustworthy first-party country-detection layer. Showing the same choice globally avoids accidentally loading GA4 for a European visitor because of incorrect geolocation.

Google Analytics does not load until the visitor chooses **Allow analytics**.

## Explorer records

Current Explorer backend behavior:
- browser creates the signed NDA PDF;
- form + PDF are POSTed to Google Apps Script;
- applicant receives their signed NDA by email;
- ARTEZIQ receives application details + signed NDA by email;
- current code does not intentionally write Explorer records to a database or Google Drive;
- a short-lived anti-abuse cache is used for rate limiting.

Updated rate-limit behavior hashes the email+app value before putting it in the Apps Script cache.

## Published retention policy

- Explorer application and ARTEZIQ NDA copy: Explorer relationship + 3 years.
- Explorer anti-abuse cache: approximately 15 minutes.
- Survey responses: normally up to 24 months.
- GA4: recommendation is 14-month event-data retention.

ARTEZIQ should actually delete records according to these periods. If operational retention changes, update `/privacy/`.

## Data-subject requests

Privacy contact currently published:
`arteziq.apps@gmail.com`

Requests may include:
- access
- correction
- deletion
- restriction
- objection
- portability where applicable
- withdrawal of analytics consent

Maintain a simple internal log of requests and disposition. Do not put the requester's sensitive information into GA4.

## International transfers

The policy discloses that ARTEZIQ is U.S.-based and that Google/GitHub processing can involve the United States or other provider locations. ARTEZIQ should periodically confirm that its service-provider terms and transfer mechanisms remain appropriate.

## 18+ Explorer requirement

All Explorer pages now require an 18+ confirmation, and the backend verifies it. This reduces privacy and contract issues associated with collecting signed NDAs from minors.

## Data minimization review recommended

The current Explorer application requires phone and city/state even when the applicant prefers email. Those fields were preserved to avoid changing the existing business workflow.

For stricter data minimization, ARTEZIQ should consider:
- making phone optional unless Phone/Text Message is selected;
- deciding whether city/state is actually necessary for every Explorer application.

## EU representative / DPO

This package does not claim that ARTEZIQ has an EU representative or Data Protection Officer. Whether one is legally required depends on the scale, regularity, targeting, and risk of ARTEZIQ's EU processing.

If ARTEZIQ begins actively marketing to EU residents at scale, routinely recruiting EU Explorers, processing sensitive data, or performing systematic monitoring, obtain qualified privacy/legal advice and reassess those obligations.

## Keep the policy accurate

Update the policy before:
- storing Explorer records in Supabase, Drive, or another database;
- adding advertising/remarketing;
- sending form content to another processor;
- collecting health/sensitive data;
- changing retention;
- using new analytics identifiers;
- accepting minors.
