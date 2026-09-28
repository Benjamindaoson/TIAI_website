import type { Locale } from "./site";

export const launchPageSlugs = [
  "admissions",
  "tuition",
  "faq",
  "accessibility",
  "non-discrimination",
  "refund-cancellation",
  "institutional-disclosures",
] as const;

export type LaunchPageSlug = (typeof launchPageSlugs)[number];

type PageSection = {
  title: string;
  body: string;
};

type LaunchPage = {
  title: string;
  description: string;
  sections: PageSection[];
};

const launchPages: Record<Locale, Record<LaunchPageSlug, LaunchPage>> = {
  en: {
    admissions: {
      title: "Admissions",
      description: "How inquiry, fit review, and institution-dependent admission steps currently work at TIAI.",
      sections: [
        {
          title: "Current status",
          body: "TIAI currently offers inquiry and readiness review. Formal admission, enrollment, and academic standing decisions remain with the authorized institution involved in a pathway.",
        },
        {
          title: "What applicants should prepare",
          body: "Prospective students should be ready to share prior study, English level, intended pathway, and timeline. Institution-specific documents may be required later.",
        },
        {
          title: "What happens next",
          body: "TIAI reviews fit, explains program boundaries, and outlines next steps. Any institutional application sequence depends on the receiving institution's policies and timeline.",
        },
      ],
    },
    tuition: {
      title: "Tuition and Financial Information",
      description: "How TIAI handles tuition and funding conversations without publishing unsupported amounts.",
      sections: [
        {
          title: "What is available today",
          body: "Public tuition tables are not published on this site because pathway cost depends on the support scope and, where applicable, the authorized institution involved. Exact figures require founder confirmation before publication.",
        },
        {
          title: "How to request information",
          body: "Students and families can request a cost conversation through the contact form. TIAI should explain which charges belong to TIAI support and which charges, if any, belong to a partner institution.",
        },
        {
          title: "Funding and scholarships",
          body: "Scholarship, aid, or discount language should not be implied unless a real program exists. Founder confirmation is required before any scholarship claim is added to the public site.",
        },
      ],
    },
    faq: {
      title: "FAQ",
      description: "Answers to the recurring questions students, families, and institutional partners ask first.",
      sections: [
        {
          title: "Does TIAI grant degrees?",
          body: "No. TIAI does not grant degrees on its own. Degree, credit, transcript, and enrollment authority remain with authorized institutions where a pathway exists.",
        },
        {
          title: "Does TIAI guarantee admission or transfer?",
          body: "No. TIAI can advise, prepare, and support. Admission, transfer, visa, and degree decisions depend on the institutions and agencies responsible for them.",
        },
        {
          title: "Who should contact TIAI?",
          body: "Students, families, faculty candidates, universities, and institutional partners can use the contact page. Different follow-up paths should be clarified based on the inquiry type.",
        },
      ],
    },
    accessibility: {
      title: "Accessibility Statement",
      description: "TIAI's current accessibility commitment for the public website.",
      sections: [
        {
          title: "Commitment",
          body: "TIAI intends to make this website usable across modern devices and assistive technologies. Accessibility issues can be reported through the contact page while the site continues to improve.",
        },
        {
          title: "Current scope",
          body: "The current site focuses on readable structure, keyboard-usable navigation, and basic form labeling. Additional testing and remediation should continue before and after launch.",
        },
      ],
    },
    "non-discrimination": {
      title: "Non-Discrimination Statement",
      description: "TIAI's public commitment to fair treatment in education-related activities.",
      sections: [
        {
          title: "Statement",
          body: "TIAI intends to provide information and support without discrimination based on protected characteristics. Any institution-specific policy must also be disclosed by the authorized institution involved.",
        },
        {
          title: "Scope",
          body: "This statement applies to TIAI's own communications and support activities. Founder confirmation is required before adding jurisdiction-specific legal wording beyond this baseline statement.",
        },
      ],
    },
    "refund-cancellation": {
      title: "Refund and Cancellation",
      description: "Current public guidance on cancellation and refund handling.",
      sections: [
        {
          title: "Current publication status",
          body: "No public refund schedule is published yet. Founder confirmation is required before publishing binding payment, refund, or cancellation terms.",
        },
        {
          title: "Interim handling",
          body: "Until a formal policy is approved, inquiries about payment timing, cancellation, or refund treatment should be handled directly and documented clearly in writing.",
        },
      ],
    },
    "institutional-disclosures": {
      title: "Institutional Disclosures",
      description: "Public boundary statements that reduce legal and trust risk on the formal TIAI website.",
      sections: [
        {
          title: "Entity and degree status",
          body: "TIAI presents itself as a Texas nonprofit educational initiative. It does not grant degrees, issue transcripts, or exercise institutional academic authority on behalf of an authorized college or university.",
        },
        {
          title: "Partnership status",
          body: "No university, college, accreditation, pathway, or faculty relationship should be presented as finalized unless founder-confirmed and supportable with real documentation.",
        },
        {
          title: "Outcome boundaries",
          body: "TIAI should not promise admission, transfer acceptance, visa approval, scholarship, employment, or degree completion. Public claims must stay within what TIAI can actually control.",
        },
      ],
    },
  },
  zh: {
    admissions: {
      title: "招生与申请",
      description: "说明当前咨询、匹配评估和院校依赖型申请流程如何开展。",
      sections: [
        {
          title: "当前状态",
          body: "TIAI 当前提供咨询与准备度评估。正式录取、注册和学术身份决定，仍由相关授权院校负责。",
        },
        {
          title: "申请前准备",
          body: "学生应准备既往学习背景、英语水平、目标路径和时间安排。若进入院校申请阶段，还可能需要按院校要求补充材料。",
        },
        {
          title: "后续步骤",
          body: "TIAI 会先说明适配度、项目边界和下一步建议。若涉及合作院校，具体申请流程与时间线取决于该院校政策。",
        },
      ],
    },
    tuition: {
      title: "费用与资助信息",
      description: "在不发布未经确认金额的前提下，说明费用信息应如何获取。",
      sections: [
        {
          title: "当前公开状态",
          body: "网站暂不公开费用表，因为成本取决于支持范围以及相关授权院校安排。任何具体金额都需要创办人确认后才能公开发布。",
        },
        {
          title: "如何获取信息",
          body: "学生和家长可以通过联系表单咨询费用。TIAI 应明确区分哪些费用属于 TIAI 支持服务，哪些费用在适用情况下属于合作院校。",
        },
        {
          title: "奖学金与资助",
          body: "在没有真实项目之前，不应暗示奖学金、助学金或减免。任何相关公开表述都需要创办人确认。",
        },
      ],
    },
    faq: {
      title: "常见问题",
      description: "回答学生、家长和合作院校最先会问的问题。",
      sections: [
        {
          title: "TIAI 是否授予学位？",
          body: "不会。TIAI 本身不授予学位。学位、学分、成绩单和正式注册权责属于相关授权院校。",
        },
        {
          title: "TIAI 是否保证录取或转学？",
          body: "不会。TIAI 可以提供准备、咨询和支持，但录取、转学、签证和学位决定取决于相关院校和主管机构。",
        },
        {
          title: "哪些人适合联系 TIAI？",
          body: "学生、家长、教师候选人、大学合作方和机构伙伴都可以联系。后续沟通路径应根据咨询类型分别说明。",
        },
      ],
    },
    accessibility: {
      title: "无障碍声明",
      description: "说明 TIAI 当前对官网可访问性的公开承诺。",
      sections: [
        {
          title: "承诺",
          body: "TIAI 希望让官网在常见设备和辅助技术上可用。若发现无障碍问题，可通过联系页面反馈，网站会继续改进。",
        },
        {
          title: "当前范围",
          body: "当前版本优先保证基本可读结构、键盘可用导航和表单基础标注。上线前后仍应继续进行测试和修正。",
        },
      ],
    },
    "non-discrimination": {
      title: "非歧视声明",
      description: "说明 TIAI 在教育相关沟通和支持中的公平原则。",
      sections: [
        {
          title: "声明",
          body: "TIAI 旨在在其自身的沟通和支持活动中，坚持不因受保护特征而差别对待。若涉及院校政策，也应由相关授权院校分别说明。",
        },
        {
          title: "适用范围",
          body: "本声明适用于 TIAI 自身活动。若要加入更具体的法律措辞，需要创办人确认后再公开发布。",
        },
      ],
    },
    "refund-cancellation": {
      title: "退款与取消",
      description: "说明当前公开的退款和取消政策状态。",
      sections: [
        {
          title: "当前公开状态",
          body: "网站目前没有公开退款时间表。任何具有约束力的付款、退款或取消条款，都需要创办人确认后再正式发布。",
        },
        {
          title: "过渡处理方式",
          body: "在正式政策批准前，所有关于付款节奏、取消和退款的问题都应直接沟通，并形成清晰的书面说明。",
        },
      ],
    },
    "institutional-disclosures": {
      title: "机构披露",
      description: "用于降低法律和信任风险的公开边界说明。",
      sections: [
        {
          title: "主体与学位状态",
          body: "TIAI 对外表述为得州非营利教育项目建设机构。除非另有合法授权，它本身不授予学位、不签发成绩单，也不独立行使大学学术权力。",
        },
        {
          title: "合作状态",
          body: "任何大学、学院、认证、路径项目或师资关系，若未获得创办人确认并具备真实依据，都不应写成既成事实。",
        },
        {
          title: "结果边界",
          body: "TIAI 不应承诺录取、转学认可、签证、奖学金、就业或学位完成。所有公开说法必须限制在 TIAI 能实际控制的范围内。",
        },
      ],
    },
  },
};

export function getLaunchPage(slug: LaunchPageSlug, locale: Locale): LaunchPage {
  return launchPages[locale][slug];
}
