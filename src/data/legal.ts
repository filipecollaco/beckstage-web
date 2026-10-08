/* Legal copy — Privacy and Cookies Policy and Terms and Conditions.
   Verbatim from the reviewed PDFs (Rev. CCA, 08/10/2026), via the Claude Design handoff
   (handoff_legal_pages, 2026-10-08). Only changes there: clause numbers aligned to their section,
   headings in sentence case, the Privacy §6 table re-joined across the page break, three typos.

   ⚠ This text is approved legal copy. Don't edit, shorten or "fix" it — not even "agency" in the
   Terms definitions (the product-copy rule doesn't apply here). Any change goes through the lawyer,
   and every revision updates `updated` + `updatedISO`.

   Blocks: p · c [num, text] · ul [text | {b, t}] · ol [text] (lettered) · table {head, rows} ·
   rights [{t, d}] · addr [lines]. Inline: hello@beckstage.music and https://www.cnpd.pt/ auto-link;
   {privacy} renders the link to /privacy. */

export type LegalItem = string | { b: string; t: string };
export type LegalBlock =
  | ['p', string]
  | ['c', string, string]
  | ['ul', LegalItem[]]
  | ['ol', string[]]
  | ['table', { head: [string, string, string]; rows: [string, string, string][] }]
  | ['rights', { t: string; d: string }[]]
  | ['addr', string[]];
export interface LegalSection { n: number; t: string; b: LegalBlock[] }
export interface LegalDoc {
  slug: 'privacy' | 'terms';
  title: string;
  updated: string;
  updatedISO: string;
  intro: string[];
  sections: LegalSection[];
}

/** Section anchor: `{n}-{slugified title}`, e.g. `6-purposes-and-legal-basis-for-processing`. */
export const sectionId = (s: LegalSection) => `${s.n}-` + s.t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const PRIVACY: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy and Cookies Policy',
  updated: '8 October 2026',
  updatedISO: '2026-10-08',
  intro: [
    'BECKSTAGE values the protection for your personal data and is committed to respecting your Privacy.',
    'In this Privacy Policy, we explain how we collect and process the personal data of all individuals who access, browse or use our website and mobile application (together, the “Platform”), including registered users and individuals whose personal data may be processed in connection with events managed through the Platform.',
    'We have tried to make this Policy as clear and transparent as possible, but if anything is unclear, please contact us at the following email address: hello@beckstage.music.',
  ],
  sections: [
    { n: 1, t: 'Legal framework', b: [
      ['p', 'Your personal data will be processed in accordance with applicable legislation on the protection of personal data, including Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 (“GDPR”), as well as Law no. 58/2019 of 8 August, which implements the GDPR in the Portuguese legal system, and other applicable legislation on privacy and electronic communications, including in relation to the use of cookies and similar technologies.'],
    ]},
    { n: 2, t: 'Data controller identification', b: [
      ['p', 'BECKSTAGE TECHNOLOGIES, LDA, with its registered office at Rua Vera Lagoa, 10, 18 A, Lisboa, with the legal person Identification number 519520211 (hereinafter referred to as “BECKSTAGE”) is responsible for the processing of personal data carried out by BECKSTAGE as data controller under the applicable data protection legislation.'],
      ['p', 'Throughout this Policy, references to “we”, “us” or “our” refer to BECKSTAGE.'],
    ]},
    { n: 3, t: 'Who we are', b: [
      ['c', '3.1', 'BECKSTAGE is a digital platform designed to support the organization and management of concerts and other musical events and to facilitate the coordination of the different professionals and entities involved in such events.'],
      ['c', '3.2', 'The Platform enables users, depending on their role and the functionalities made available to them, to create and manage events, invite artists, musicians, technicians and other participants, share logistical and technical information, coordinate responsibilities and assignments, and record information relating to participants and amounts due following an event.'],
      ['c', '3.3', 'This Privacy Policy sets out the main information regarding how BECKSTAGE processes personal data in connection with the Platform and the services provided through it.'],
    ]},
    { n: 4, t: 'What categories of personal data do we collect?', b: [
      ['c', '4.1', 'Personal data is any information relating to an identified or identifiable natural person. An identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, identification number, location data, online identifier or to one or more elements specific to that person’s physical, physiological, genetic, mental, economic, cultural or social identity.'],
      ['c', '4.2', 'Depending on how you use the Platform and on the functionalities made available to you, we may process the following categories of personal data:'],
      ['ul', [
        { b: 'Identification data:', t: 'first and last name, username or display name, profile picture, user/account identifier and professional role.' },
        { b: 'Contact data:', t: 'e-mail address, phone number.' },
        { b: 'Location data:', t: 'location information (city and country) selected or provided by the User when creating an Account through the Google Places API.' },
        { b: 'Professional and activity data:', t: 'professional category or role, information relating to your participation in concerts and other events, assigned responsibilities and other professional information made available through the Platform.' },
        { b: 'Technical and usage data:', t: 'IP address, device type, operating system, browser or application version, access logs, authentication information, security-related information and information regarding your interaction with the Platform.' },
        { b: 'Communications data:', t: 'information contained in communications exchanged with BECKSTAGE, including communications with our customer support services.' },
        { b: 'Financial and payment data:', t: 'information relating to amounts due, payments and payment status in connection with events and the use of the Platform.' },
      ]],
      ['p', 'The categories of personal data actually processed will depend on the Platform functionalities you use, your role and the events in which you participate/promote.'],
    ]},
    { n: 5, t: 'Personal data provided by other users', b: [
      ['c', '5.1', 'Some personal data processed through the Platform may be provided by another user, including an artist, producer, promoter, event organizer or other participant.'],
      ['c', '5.2', 'For example, another user may provide your name, contact details, professional information or information relating to your participation in an event in order to invite you to an event, assign responsibilities to you or coordinate the relevant event.'],
      ['c', '5.3', 'Where personal data is provided by another user, we may process such data for the purposes described in this Policy. Where required by applicable data protection law, we will provide the relevant information concerning the source of such personal data.'],
    ]},
    { n: 6, t: 'Purposes and legal basis for processing', b: [
      ['p', 'We have identified in the table below some of the purposes for which we process your personal data, as well as the corresponding legal bases for such processing:'],
      ['table', { head: ['Purpose', 'Categories of data', 'Legal basis'], rows: [
        ['Creating and managing your BECKSTAGE account', 'Identification data, contact data, location data (optional) and technical and usage data', 'Performance of a contract or taking steps at your request prior to entering into a contract'],
        ['Providing, maintaining and operating the Platform', 'Identification data, contact data, technical and usage data, professional and activity data', 'Performance of a contract'],
        ['Creating, organizing and managing concerts and other events', 'Identification data, professional and activity data, financial and payment data', 'Performance of a contract'],
        ['Sending invitations and other communications relating to events', 'Identification and contact data', 'Performance of a contract and/or legitimate interests, as applicable'],
        ['Coordinating participants, responsibilities and assignments', 'Identification, professional and activity data', 'Performance of a contract'],
        ['Providing customer support and responding to requests', 'Identification, contact and communications data', 'Performance of a contract and/or legitimate interests'],
        ['Ensuring the security, integrity and proper functioning of the Platform', 'Technical and usage data', 'Legitimate interests'],
        ['Preventing fraud, misuse and security incidents', 'Identification, technical and usage data', 'Legitimate interest and/or compliance with legal obligations, as applicable'],
        ['Complying with legal and regulatory obligations', 'Relevant categories of personal data', 'Compliance with a legal obligation'],
        ['Sending marketing and promotional communications, where applicable', 'Identification and contact data', 'Consent and/or legitimate interests, where legally permissible'],
        ['Analyzing and improving the Platform and our services', 'Technical and usage data and, where applicable, aggregated or pseudonymized data', 'Legitimate interests and/or consent, as applicable'],
      ]}],
    ]},
    { n: 7, t: 'With whom we share your data', b: [
      ['c', '7.1', 'In the context of the operation of the Platform, we may share your personal data with service providers and other entities that support us in providing and maintaining the Platform, such as hosting, cloud infrastructure, software, communications, customer support, security, analytics and other technology service providers.'],
      ['c', '7.2', 'Where such entities process personal data on behalf of BECKSTAGE, they will only process such data in accordance with our documented instructions and subject to appropriate contractual, technical and organizational safeguards.'],
      ['c', '7.3', 'Depending on your role and the functionalities used, certain personal data may also be made available to other users or participants in an event, including artists, musicians, technicians, producers, promoters, event organizers or other professionals involved in the relevant event. The information made available will depend on the purpose of the relevant event, the user’s role, the permissions configured and the functionalities of the Platform.'],
      ['c', '7.4', 'We may also communicate your personal data to third parties:'],
      ['ul', [
        'where this is necessary for the performance of a contract;',
        'where required to comply with a legal or regulatory obligation;',
        'where necessary to establish, exercise or defend legal claims; or',
        'where you have provided your consent, where consent is the applicable legal basis.',
      ]],
    ]},
    { n: 8, t: 'International transfers', b: [
      ['p', 'We may transfer your personal data outside the European Union or the European Economic Area (“EEA”) where necessary for the purposes described in this Policy. Where such transfers take place, we will ensure that the applicable requirements under European data protection law are met, including by relying, where applicable, on an adequacy decision, the European Commission’s Standard Contractual Clauses or another lawful transfer mechanism. Where required by applicable law, we will provide information on the relevant safeguards and on how to obtain a copy of them or where they have been made available.'],
    ]},
    { n: 9, t: 'Retention period', b: [
      ['c', '9.1', 'We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, unless a longer retention period is required or permitted by applicable law.'],
      ['c', '9.2', 'The retention period will depend on the nature of the data and the purpose for which it is processed. In particular, personal data relating to user accounts, events, event participation, communications and amounts due may be retained for as long as necessary to provide the Platform and maintain the relevant records, and thereafter for any additional period required to comply with legal obligations or to establish, exercise or defend legal claims.'],
    ]},
    { n: 10, t: 'Rights of the data subject', b: [
      ['c', '10.1', 'We seek to ensure that personal data processed by us is accurate, up to date and complete, taking into account the purposes for which it is processed.'],
      ['c', '10.2', 'Subject to the applicable legal requirements and limitations, you may exercise the following rights:'],
      ['rights', [
        { t: 'Right to be informed', d: 'You have the right to obtain clear, transparent, and easily understandable information about how we use your personal data.' },
        { t: 'Right of access', d: 'You have the right to request confirmation as to whether we process your personal data and, where applicable, to obtain access to such data and to certain information about its processing.' },
        { t: 'Right to rectification', d: 'You have the right to request the rectification of inaccurate personal data and the completion of incomplete personal data.' },
        { t: 'Right to erasure', d: 'You may request the erasure of your personal data where the applicable legal requirements are met. This right is not absolute and may be subject to legal exceptions.' },
        { t: 'Right to object', d: 'You may object to the processing of your personal data where the applicable legal requirements are met, including where your data is processed on the basis of our legitimate interests or for direct marketing purposes.' },
        { t: 'Right to withdraw consent', d: 'Where processing is based on your consent, you have the right to withdraw that consent at any time. The withdrawal of consent does not affect the lawfulness of processing carried out before such withdrawal.' },
        { t: 'Right to data portability', d: 'Where applicable, you have the right to receive the personal data you have provided to us in a structured, commonly used and machine-readable format and to transmit it to another controller, in accordance with the applicable legal requirements.' },
        { t: 'Right to restriction of processing', d: 'You may request the restriction of the processing of your personal data in the circumstances provided for by applicable data protection legislation.' },
        { t: 'Right to lodge a complaint with the national data protection authority', d: 'You also have the right to lodge a complaint with the competent supervisory authority. In Portugal, the competent authority is the Comissão Nacional de Proteção de Dados (“CNPD”). Further information is available at https://www.cnpd.pt/.' },
      ]],
    ]},
    { n: 11, t: 'How to exercise such rights', b: [
      ['c', '11.1', 'You may exercise your rights by contacting us using the contact details provided in the “CONTACTS” section below.'],
      ['c', '11.2', 'When submitting a request, we may ask you to provide additional information necessary to confirm your identity and to process your request securely.'],
      ['c', '11.3', 'We will respond to your request within the period required by applicable data protection legislation.'],
    ]},
    { n: 12, t: 'Automated decision-making', b: [
      ['p', 'BECKSTAGE does not currently use personal data to make decisions based solely on automated processing that produce legal effects or similarly significantly affect individuals.'],
    ]},
    { n: 13, t: 'Security measures', b: [
      ['c', '13.1', 'We implement appropriate technical and organisational measures designed to protect personal data against accidental or unlawful destruction, loss, alteration, unauthorised disclosure, unauthorised access and other unlawful forms of processing, taking into account the nature, scope, context and purposes of the processing and the risks involved.'],
      ['c', '13.2', 'These measures may include, where appropriate, access controls, authentication mechanisms, encryption, logging, backup procedures, confidentiality measures and other security safeguards.'],
      ['c', '13.3', 'We maintain procedures designed to identify, assess and respond to personal data breaches and other security incidents and regularly review our technical and organizational measures.'],
    ]},
    { n: 14, t: 'How to be informed about potential changes to our Privacy Policy', b: [
      ['c', '14.1', 'Our practices regarding the processing of personal data may change from time to time. Accordingly, this Policy may be updated when necessary.'],
      ['c', '14.2', 'We recommend that you review this Policy periodically. Where required by applicable law, we will inform you of material changes through appropriate means, which may include email, notifications through the Platform or other communications.'],
    ]},
    { n: 15, t: 'Contacts', b: [
      ['c', '15.1', 'If you have any questions regarding this Privacy and Cookies Policy, would like to obtain further information about the processing of your personal data, or wish to exercise your rights as a data subject, please contact BECKSTAGE at:'],
      ['addr', ['BECKSTAGE TECHNOLOGIES, LDA.', 'Address: Rua Vera Lagoa, 10, 18 A, Lisbon', 'E-mail: hello@beckstage.music']],
      ['c', '15.2', 'For requests relating to personal data processed by BECKSTAGE on behalf of one of its business customers, we may direct your request to the relevant customer, as data controller, where appropriate.'],
    ]},
  ],
};

export const TERMS: LegalDoc = {
  slug: 'terms',
  title: 'Terms and Conditions',
  updated: '8 October 2026',
  updatedISO: '2026-10-08',
  intro: [
    'Welcome to BECKSTAGE.',
    'These Terms and Conditions govern access to and use of the BECKSTAGE Platform.',
    'By accessing or using the Platform, the User agrees to be bound by these Terms. If you do not agree with these Terms, you must not access or use the Platform.',
  ],
  sections: [
    { n: 1, t: 'Object and scope of application', b: [
      ['c', '1.1', 'The BECKSTAGE Platform is owned and operated by BECKSTAGE TECHNOLOGIES, LDA, a company incorporated under the laws of Portugal, with registered office at Rua Vera Lagoa, 10, 18 A, Lisboa, legal person identification number 519520211 and email address hello@beckstage.music (hereinafter referred to as “BECKSTAGE”).'],
      ['c', '1.2', 'These Terms govern access to and use of the Platform and the services and functionalities made available through it by all Users of the Platform.'],
      ['c', '1.3', 'The Platform is designed to support the organization and management of concerts and other musical events and to facilitate the coordination of the artists, musicians, technicians, producers, promoters and other professionals and entities involved in such events.'],
    ]},
    { n: 2, t: 'Definitions', b: [
      ['c', '2.1', 'For the purposes of these Terms:'],
      ['ul', [
        { b: '“Account”', t: 'means the registered user account created by a User to access and use the Platform, including the associated login credentials.' },
        { b: '“Artist”', t: 'means a musician, performer or other individual whose artistic services may be the subject of a Booking or Deal.' },
        { b: '“Booking”', t: 'means a concert, performance or other engagement created or managed through the Platform.' },
        { b: '“Deal”', t: 'means the record, within the Platform, of certain terms of an existing representation arrangement between an Artist and an agency or other representative, including, where applicable, the commission and scope of representation.' },
        { b: '“Platform” or “Beckstage Platform”', t: 'means the BECKSTAGE website, mobile application and related services.' },
        { b: '“Party”', t: 'means BECKSTAGE or a User, and “Parties” means both of them.' },
        { b: '“Representative”', t: 'means an agency or other User authorized, through a Deal, to act on behalf of an Artist within the Platform.' },
        { b: '“Role”', t: 'means the function or capacity assigned to a User in connection with a Booking or within the Platform.' },
        { b: '“Terms”', t: 'means these Terms and Conditions, as amended from time to time.' },
        { b: '“User”', t: 'means any individual or entity accessing or using the Platform.' },
        { b: '“User Content”', t: 'means any information, document, image or other content submitted or uploaded by a User through the Platform.' },
      ]],
      ['c', '2.2', 'Capitalized terms defined in these Terms and Conditions may be used in the singular or the plural and shall retain the same meaning.'],
    ]},
    { n: 3, t: 'The BECKSTAGE Platform', b: [
      ['c', '3.1', 'BECKSTAGE provides digital tools designed to support the organization and management of Bookings and the coordination of the Users involved in them.'],
      ['c', '3.2', 'Depending on the User’s Role and the functionalities available, the Platform may allow Users to create and manage Bookings, invite other Users, share and manage information, assign responsibilities and manage logistical, technical and financial information relating to a Booking.'],
      ['c', '3.3', 'Where an agreement between an Artist and an agency or other representative is recorded through a Deal, the Platform may allow such agency or representative to create and manage Bookings on behalf of the Artist, according to the terms recorded through the Platform and the permissions available.'],
      ['c', '3.4', 'Information regarding Bookings and the amounts recorded through the Platform is provided on the basis of information entered by Users. BECKSTAGE does not verify such information and does not process or make payments between Users.'],
    ]},
    { n: 4, t: 'User accounts and access to the Platform', b: [
      ['c', '4.1', 'Access to and use of the Platform require the User to create and maintain an Account and provide the information requested for registration. Users may be invited to join the Platform by other Users through the use of their email address, but must complete the registration process and create an Account before accessing any information or using any functionality of the Platform.'],
      ['c', '4.2', 'Users must be at least 18 years of age to create an Account and use the Platform. By creating an Account, the User represents that they meet this age requirement.'],
      ['c', '4.3', 'Users must ensure that the information provided is accurate, complete and up to date and are responsible for keeping their login credentials secure and confidential.'],
      ['c', '4.4', 'Users are responsible for all activity carried out through their Account and must immediately notify BECKSTAGE of any unauthorized access or use.'],
      ['c', '4.5', 'Access to certain functionalities and information may vary according to the User’s Role and the permissions assigned through the Platform.'],
      ['c', '4.6', 'Where a User accesses or uses the Platform on behalf of an entity, the User represents that they are duly authorized to act on behalf of that entity. The User shall remain solely responsible for any acts or omissions in connection with such use and shall indemnify and hold BECKSTAGE harmless from any claims, losses or damages arising therefrom.'],
    ]},
    { n: 5, t: 'Bookings and participants', b: [
      ['c', '5.1', 'Users may create, manage or participate in Bookings through the Platform, according to their respective Role and permissions.'],
      ['c', '5.2', 'Users may invite other individuals or entities to participate in a Booking and may share information with them through the Platform.'],
      ['c', '5.3', 'The creation of a Booking or the sending or acceptance of an invitation through the Platform does not, in itself, establish any contractual or professional relationship between the relevant Users, unless otherwise agreed directly between them through an enforceable agreement.'],
    ]},
    { n: 6, t: 'Deals', b: [
      ['c', '6.1', 'The Platform may allow Users to create and manage a Deal recording certain terms of an existing representation arrangement between an Artist and an agency or other representative, including the applicable commission, scope of representation and territory.'],
      ['c', '6.2', 'Users are responsible for ensuring that the terms recorded in a Deal accurately reflect the agreement between the relevant parties.'],
      ['c', '6.3', 'A Deal will become active within the Platform when all relevant parties to the Deal have accepted the terms recorded in it. Such confirmation may enable the agency or representative to access and use the relevant functionalities of the Platform on behalf of the Artist, in accordance with the scope of representation recorded in the Deal.'],
      ['c', '6.4', 'BECKSTAGE provides the technical functionality to record and manage Deals but does not negotiate, determine or verify their terms and is not a party to the underlying agreement between the relevant parties to the Deal.'],
      ['c', '6.5', 'Any replacement or termination of a Deal shall be made by the relevant parties in accordance with the terms agreed between them and, where applicable, through the functionalities made available by the Platform.'],
    ]},
    { n: 7, t: 'Accounting and financial information', b: [
      ['c', '7.1', 'The Platform may allow Users to record and organize financial information relating to a Booking, including fees, expenses, commissions, earnings and amounts payable or receivable.'],
      ['c', '7.2', 'Users are responsible for the accuracy of the financial information entered into the Platform and for verifying such information before closing or locking the relevant Booking accounts.'],
      ['c', '7.3', 'Once the accounts of a Booking are closed and locked through the Platform, certain financial information may no longer be editable, subject to the functionalities made available by BECKSTAGE.'],
      ['c', '7.4', 'BECKSTAGE does not process payments between Users. Any payment, collection, reimbursement or settlement of amounts recorded through the Platform shall be made directly between the relevant parties.'],
      ['c', '7.5', 'Any indication that an amount has been marked as paid, settled or otherwise completed through the Platform reflects information entered or confirmed by Users and does not constitute confirmation by BECKSTAGE that the relevant payment has actually been made.'],
    ]},
    { n: 8, t: 'User obligations and acceptable use', b: [
      ['p', 'Users shall use the Platform in accordance with these Terms and applicable law and shall, in particular:'],
      ['ol', [
        'provide accurate and up-to-date information;',
        'keep their Account credentials confidential and not allow unauthorized persons to access their Account;',
        'not impersonate another person or entity or otherwise provide false or misleading information;',
        'not use the Platform for unlawful, fraudulent or unauthorized purposes;',
        'not upload or share content that infringes the rights of BECKSTAGE or third parties, including intellectual property, privacy or confidentiality rights; and',
        'not interfere with the security or proper functioning of the Platform.',
      ]],
      ['p', 'Users are responsible for the information and content they provide or share through the Platform.'],
    ]},
    { n: 9, t: 'User content and uploaded materials', b: [
      ['c', '9.1', 'Users may submit, upload or otherwise make available User Content through the Platform.'],
      ['c', '9.2', 'Users remain responsible for the User Content they provide and must ensure that they have the necessary rights and authorizations to use and share such content through the Platform.'],
      ['c', '9.3', 'By submitting or uploading User Content, Users grant BECKSTAGE a non-exclusive right to store, reproduce and otherwise process such content to the extent necessary to operate and provide the Platform and its functionalities.'],
      ['c', '9.4', 'BECKSTAGE may remove or restrict access to User Content where reasonably necessary to comply with applicable law, these Terms or a request from a competent authority.'],
    ]},
    { n: 10, t: 'Intellectual property', b: [
      ['c', '10.1', 'All intellectual property rights in and to the Platform, including its software, design, interfaces, trademarks, logos, texts and other content made available by BECKSTAGE, belong to BECKSTAGE or its licensors.'],
      ['c', '10.2', 'Subject to these Terms, BECKSTAGE grants Users a limited, non-exclusive, non-transferable and revocable right to access and use the Platform for its intended purposes.'],
      ['c', '10.3', 'Users shall not copy, modify, reproduce, distribute, reverse engineer or otherwise exploit the Platform or any of its components, except where expressly permitted by law.'],
    ]},
    { n: 11, t: 'Availability, maintenance and changes to the Platform', b: [
      ['c', '11.1', 'BECKSTAGE will use reasonable efforts to keep the Platform available and operational, but does not guarantee uninterrupted or error-free access.'],
      ['c', '11.2', 'The Platform may be temporarily unavailable or have limited functionality due to maintenance, updates, technical issues, security incidents or circumstances beyond BECKSTAGE’s reasonable control.'],
      ['c', '11.3', 'BECKSTAGE may modify, update or discontinue functionalities of the Platform where reasonably necessary, including for technical, security or legal reasons.'],
    ]},
    { n: 12, t: 'Third-party services and integrations', b: [
      ['c', '12.1', 'The Platform may use or integrate with services and technologies provided by third parties, including hosting, communications, authentication, analytics or other technical services.'],
      ['c', '12.2', 'The availability and use of certain functionalities may therefore depend on third-party services. BECKSTAGE shall not be responsible for interruptions or failures attributable to such third parties, except where otherwise required by applicable law.'],
    ]},
    { n: 13, t: 'Fees and subscription', b: [
      ['c', '13.1', 'Access to and use of the Platform may be subject to fees or subscription charges, depending on the services and plan selected by the User.'],
      ['c', '13.2', 'Where applicable, the applicable fees, billing conditions and other relevant terms will be made available to the User before the relevant service is activated.'],
    ]},
    { n: 14, t: 'Data protection', b: [
      ['p', 'BECKSTAGE processes personal data in accordance with applicable data protection legislation, including Regulation (EU) 2016/679 (General Data Protection Regulation). Further information on the processing of personal data in connection with the Platform, including the categories of data processed, the purposes and legal bases for processing, data retention periods and the rights of data subjects, is available in the BECKSTAGE Privacy and Cookies Policy, available at {privacy}.'],
    ]},
    { n: 15, t: 'Liability', b: [
      ['c', '15.1', 'BECKSTAGE shall provide the Platform with reasonable care and skill. However, BECKSTAGE does not guarantee that the Platform will always be available, uninterrupted or error-free.'],
      ['c', '15.2', 'BECKSTAGE is not responsible for the accuracy, completeness or legality of information or content provided by Users, or for the acts or omissions of Users in connection with their use of the Platform.'],
      ['c', '15.3', 'BECKSTAGE provides a technology platform and is not a party to any agreement or arrangement between Users, including any Deal or Booking, nor does it act as an agent, representative, employer, producer, promoter or other intermediary between them. BECKSTAGE is not responsible for the performance of such agreements or for disputes arising between the relevant parties.'],
      ['c', '15.4', 'BECKSTAGE does not verify the terms of any Deal, Booking or other arrangement recorded through the Platform and is not responsible for whether the information recorded accurately reflects the agreement between the relevant Users.'],
      ['c', '15.5', 'Information concerning fees, commissions, expenses, earnings, balances or other amounts displayed or calculated through the Platform is based on information provided by Users and does not constitute verification by BECKSTAGE of any payment obligation or entitlement. BECKSTAGE does not make, process or guarantee payments between Users.'],
      ['c', '15.6', 'Nothing in these Terms excludes or limits BECKSTAGE’s liability to the extent that such exclusion or limitation is not permitted by applicable law.'],
      ['c', '15.7', 'To the maximum extent permitted by applicable law, BECKSTAGE’s total aggregate liability to any User under or in connection with these Terms, whether in contract, tort (including negligence), breach of statutory duty or otherwise, shall not exceed the total fees paid by that User to BECKSTAGE during the twelve (12) months immediately preceding the event giving rise to the claim.'],
    ]},
    { n: 16, t: 'Suspension and termination', b: [
      ['c', '16.1', 'Users may cease using the Platform at any time and, where applicable, request the closure of their Account.'],
      ['c', '16.2', 'BECKSTAGE may suspend or terminate access to the Platform or to an Account where reasonably necessary, including in the event of a breach of these Terms, unlawful or abusive use of the Platform, or where required for security or legal reasons.'],
      ['c', '16.3', 'Where reasonably possible, BECKSTAGE will inform the User of the suspension or termination and, where appropriate, provide an opportunity to remedy the relevant breach.'],
      ['c', '16.4', 'Suspension or termination of access to the Platform shall not affect any rights or obligations which, by their nature, are intended to survive termination.'],
    ]},
    { n: 17, t: 'Amendments to these Terms', b: [
      ['c', '17.1', 'BECKSTAGE may amend these Terms from time to time, including to reflect changes to the Platform, its functionalities or applicable law. BECKSTAGE will provide Users with at least ten (10) days’ prior notice of any material amendments.'],
      ['c', '17.2', 'Any amendments will be made available through the Platform or otherwise communicated to Users where appropriate.'],
      ['c', '17.3', 'The amended Terms will apply from the date indicated by BECKSTAGE.'],
      ['c', '17.4', 'If a User does not agree with any material amendment to these Terms, the User may terminate their Account and cease using the Platform before the amended Terms come into effect. Continued use of the Platform after the amended Terms come into effect shall constitute acceptance of the amended Terms.'],
    ]},
    { n: 18, t: 'Applicable law and dispute resolution', b: [
      ['c', '18.1', 'These Terms shall be governed by Portuguese law, without prejudice to any mandatory provisions of law applicable to the User.'],
      ['c', '18.2', 'Any dispute arising out of or in connection with these Terms shall, where possible, be resolved amicably between the parties.'],
      ['c', '18.3', 'Subject to any mandatory provisions of law applicable to consumers, the Portuguese courts shall have jurisdiction over any disputes arising out of or in connection with these Terms.'],
    ]},
    { n: 19, t: 'Assignment', b: [
      ['p', 'Users may not assign, transfer or sublicense any of their rights or obligations under these Terms without the prior written consent of BECKSTAGE. BECKSTAGE may assign or transfer these Terms, in whole or in part, to any affiliate or in connection with a merger, acquisition, reorganization or sale of all or substantially all of its assets, provided that the assignee agrees to be bound by these Terms.'],
    ]},
    { n: 20, t: 'Severability', b: [
      ['p', 'If any provision of these Terms is found to be invalid, illegal or unenforceable by a court or other competent authority, such invalidity, illegality or unenforceability shall not affect the remaining provisions, which shall remain in full force and effect. The invalid, illegal or unenforceable provision shall be replaced by a valid, legal and enforceable provision that most closely reflects the original intent of the Parties.'],
    ]},
    { n: 21, t: 'Entire agreement', b: [
      ['p', 'These Terms, together with the Privacy and Cookies Policy and any other policies or guidelines published on the Platform, constitute the entire agreement between the Parties with respect to the subject matter hereof and supersede all prior or contemporaneous communications, representations or agreements, whether oral or written.'],
    ]},
    { n: 22, t: 'Contacts', b: [
      ['p', 'If you have any questions regarding these Terms or the Platform, you may contact BECKSTAGE at:'],
      ['addr', ['BECKSTAGE TECHNOLOGIES, LDA', 'Rua Vera Lagoa, 10, 18 A, Lisboa', 'hello@beckstage.music']],
    ]},
  ],
};

export const LEGAL_DOCS = { privacy: PRIVACY, terms: TERMS };
