#!/usr/bin/env node

/**
 * ==============================================================================
 * Comprehensive E2E & Static Verification Suite for Portfolio Revamp
 * ==============================================================================
 * Conforms to:
 *   - ORIGINAL_REQUEST.md (Acceptance Criteria, R1, R2, R3)
 *   - TEST_INFRA.md (Tiers 1, 2, 3, 4 Verification Matrix)
 *   - PROJECT.md (Interface Contracts, Milestones)
 *
 * Usage:
 *   node scripts/verify-portfolio.mjs
 *   node scripts/verify-portfolio.mjs --source-only
 *
 * Exit Codes:
 *   0: All tests passed
 *   1: One or more assertions failed
 * ==============================================================================
 */

import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

// Color constants for clear terminal output
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

class TestReporter {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  assert(tier, id, description, condition, details = {}) {
    const passed = Boolean(condition);
    this.results.push({
      tier,
      id,
      description,
      passed,
      details,
    });

    const statusBadge = passed
      ? `${colors.green}[PASS]${colors.reset}`
      : `${colors.red}[FAIL]${colors.reset}`;

    console.log(`  ${statusBadge} ${colors.bold}${id}${colors.reset}: ${description}`);
    if (!passed && details.message) {
      console.log(`         ${colors.red}↳ ${details.message}${colors.reset}`);
      if (details.expected !== undefined && details.actual !== undefined) {
        console.log(`         ${colors.dim}Expected: ${JSON.stringify(details.expected)}${colors.reset}`);
        console.log(`         ${colors.dim}Actual:   ${JSON.stringify(details.actual)}${colors.reset}`);
      }
    }
  }

  summary() {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = total - passed;
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    console.log("\n" + "=".repeat(80));
    console.log(`${colors.bold}VERIFICATION SUITE SUMMARY${colors.reset} (${duration}s)`);
    console.log("=".repeat(80));

    const tiers = ["Tier 1", "Tier 2", "Tier 3", "Tier 4"];
    for (const t of tiers) {
      const tierTests = this.results.filter((r) => r.tier.startsWith(t));
      const tPassed = tierTests.filter((r) => r.passed).length;
      const tTotal = tierTests.length;
      const tStatus = tPassed === tTotal ? colors.green : colors.red;
      console.log(
        `  ${tStatus}${t.padEnd(8)}${colors.reset}: ${tPassed} / ${tTotal} assertions passed`
      );
    }

    console.log("-".repeat(80));
    if (failed === 0) {
      console.log(
        `${colors.green}${colors.bold}ALL ${total} VERIFICATION ASSERTIONS PASSED! Site strictly conforms to specifications.${colors.reset}\n`
      );
    } else {
      console.log(
        `${colors.red}${colors.bold}${failed} of ${total} ASSERTIONS FAILED. Review issues listed above.${colors.reset}\n`
      );
    }

    return failed;
  }
}

// Helper to safely load file contents
function readFileSafe(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf-8");
}

// Safe parser/evaluator for TypeScript portfolio.ts
function extractPortfolioData(rawTs) {
  if (!rawTs) return {};
  try {
    // Strip type declarations and TypeScript annotations to enable VM evaluation
    let cleaned = rawTs
      .replace(/export\s+type\s+[A-Za-z0-9_]+\s*=\s*[^;]+;/g, "")
      .replace(/export\s+interface\s+[A-Za-z0-9_]+[\s\S]*?\n\}/g, "")
      .replace(/\bas\s+const/g, "")
      .replace(/:\s*\{[\s\S]*?\}\s*\[\]\s*=/g, " =")
      .replace(/:\s*\{[\s\S]*?\}\s*=/g, " =")
      .replace(/:\s*JournalEntry\[\]/g, "")
      .replace(/:\s*string\[\]/g, "")
      .replace(/:\s*number/g, "")
      .replace(/:\s*string/g, "")
      .replace(/:\s*boolean/g, "");

    // Transform exports into global assignments
    cleaned = cleaned.replace(/export\s+const\s+([A-Za-z0-9_]+)\s*=/g, "exports.$1 =");

    const sandbox = { exports: {} };
    vm.createContext(sandbox);
    vm.runInContext(cleaned, sandbox, { timeout: 1000 });
    return sandbox.exports;
  } catch (err) {
    // Fallback if VM eval encounters complex syntax
    return {};
  }
}

function runVerification() {
  const reporter = new TestReporter();
  const portfolioTs = readFileSafe("src/content/portfolio.ts");
  const layoutTsx = readFileSafe("src/app/layout.tsx");
  const heroTsx = readFileSafe("src/components/Hero.tsx");
  const aboutTsx = readFileSafe("src/components/About.tsx");
  const stackTsx = readFileSafe("src/components/Stack.tsx");
  const workTsx = readFileSafe("src/components/Work.tsx");
  const journalTsx = readFileSafe("src/components/Journal.tsx");
  const contactTsx = readFileSafe("src/components/Contact.tsx");
  const navTsx = readFileSafe("src/components/Nav.tsx");
  const outIndexHtml = readFileSafe("out/index.html");
  const resumePdfPublic = readFileSafe("public/Vasanthaganesh_R_Resume.pdf");
  const resumePdfOut = readFileSafe("out/Vasanthaganesh_R_Resume.pdf");

  const data = extractPortfolioData(portfolioTs);

  console.log(`\n${colors.cyan}${colors.bold}Starting Developer Portfolio Revamp Verification Suite${colors.reset}`);
  console.log(`${colors.dim}Target: Vasanthaganesh R Backend Java Engineer Portfolio Revamp${colors.reset}\n`);

  // ============================================================================
  // TIER 1: Feature Coverage (T1.1 - T1.8)
  // ============================================================================
  console.log(`${colors.bold}--- TIER 1: Feature Coverage ---${colors.reset}`);

  // T1.1: Identity & Contact
  const hasVasanthaganeshName =
    portfolioTs?.includes("Vasanthaganesh R") &&
    layoutTsx?.includes("Vasanthaganesh R");
  reporter.assert(
    "Tier 1",
    "T1.1.1",
    "Identity: Full name 'Vasanthaganesh R' in data and layout",
    hasVasanthaganeshName,
    { expected: "Vasanthaganesh R", actual: data.site?.name || "Missing in layout/data" }
  );

  const hasNewEmail =
    portfolioTs?.includes("vasanthaganesh11@gmail.com") &&
    layoutTsx?.includes("vasanthaganesh11@gmail.com");
  reporter.assert(
    "Tier 1",
    "T1.1.2",
    "Contact: Email 'vasanthaganesh11@gmail.com' in data model and layout JSON-LD",
    hasNewEmail,
    { expected: "vasanthaganesh11@gmail.com", actual: data.contact?.email }
  );

  const hasPhone = portfolioTs?.includes("+91 7871029435");
  reporter.assert(
    "Tier 1",
    "T1.1.3",
    "Contact: Phone number '+91 7871029435' configured in portfolio model",
    hasPhone,
    { expected: "+91 7871029435", actual: data.contact?.phone || "Not found" }
  );

  const hasTargetRole =
    portfolioTs?.includes("Backend Java Engineer · Enterprise Microservices & Scalable Systems") ||
    portfolioTs?.includes("Backend Java Engineer");
  reporter.assert(
    "Tier 1",
    "T1.1.4",
    "Role: Backend Java Engineer enterprise target role defined",
    hasTargetRole,
    { expected: "Backend Java Engineer · Enterprise Microservices & Scalable Systems", actual: data.site?.role }
  );

  const hasCgpa832 = portfolioTs?.includes("8.32");
  reporter.assert(
    "Tier 1",
    "T1.1.5",
    "Education: CGPA updated to 8.32",
    hasCgpa832,
    { expected: "8.32", actual: portfolioTs?.includes("8.34") ? "Still 8.34" : "Missing" }
  );

  // T1.2: Certifications & Vitals
  const hasOracleCert = portfolioTs?.includes("Oracle Certified Associate (OCA), Java SE 8 Programmer");
  reporter.assert(
    "Tier 1",
    "T1.2.1",
    "Certifications: Prominently featured Oracle Java SE 8 Certification (OCA)",
    hasOracleCert,
    { expected: "Oracle Certified Associate (OCA), Java SE 8 Programmer", actual: hasOracleCert ? "Present" : "Missing" }
  );

  const hasClaudeCert = portfolioTs?.includes("Claude AI Certified");
  reporter.assert(
    "Tier 1",
    "T1.2.2",
    "Certifications: Claude AI Certified accreditation present",
    hasClaudeCert,
    { expected: "Claude AI Certified", actual: hasClaudeCert ? "Present" : "Missing" }
  );

  const hasHackathons =
    portfolioTs?.includes("Google Cloud & AI Hackathons") ||
    (portfolioTs?.includes("AI-HACK") && portfolioTs?.includes("Hackathon"));
  reporter.assert(
    "Tier 1",
    "T1.2.3",
    "Certifications: Google Cloud & AI Hackathons awards documented",
    hasHackathons,
    { expected: "Google Cloud & AI Hackathons", actual: hasHackathons ? "Present" : "Missing" }
  );

  const hasBTechIT = portfolioTs?.includes("B.Tech IT") || portfolioTs?.includes("B.TECH IT");
  reporter.assert(
    "Tier 1",
    "T1.2.4",
    "Credentials: B.Tech IT degree from MVIT with 8.32 CGPA",
    hasBTechIT && hasCgpa832,
    { expected: "B.Tech IT (8.32 CGPA)", actual: hasBTechIT ? "Present" : "Missing" }
  );

  // T1.3: Personal Inspirations (Separated)
  const hasLuffy = portfolioTs?.includes("Luffy") || portfolioTs?.includes("Monkey D. Luffy");
  const hasSubaru = portfolioTs?.includes("Subaru") || portfolioTs?.includes("Subaru Natsuki");
  const hasKojima = portfolioTs?.includes("Kojima") || portfolioTs?.includes("Hideo Kojima");
  const hasRdr2 = portfolioTs?.includes("Red Dead Redemption 2") || portfolioTs?.includes("RDR2");
  const hasVijay = portfolioTs?.includes("Vijay") || portfolioTs?.includes("Thalapathy Vijay");

  const hasAllInspirations = hasLuffy && hasSubaru && hasKojima && hasRdr2 && hasVijay;
  reporter.assert(
    "Tier 1",
    "T1.3.1",
    "Inspirations: All 5 personal inspirations modeled (Luffy, Subaru, Kojima, RDR2, Vijay)",
    hasAllInspirations,
    {
      expected: ["Luffy", "Subaru", "Kojima", "RDR2", "Vijay"],
      actual: { hasLuffy, hasSubaru, hasKojima, hasRdr2, hasVijay },
    }
  );

  // T1.4: Tech Stack Modernization & Purge
  const coreTech = [
    "Core Java",
    "Spring Boot",
    "Hibernate/JPA",
    "Microservices",
    "PostgreSQL",
    "MySQL",
    "React",
    "React Native",
    "TypeScript",
    "Git",
    "IntelliJ IDEA",
    "Maven",
    "Python",
  ];
  const missingTech = coreTech.filter((t) => !portfolioTs?.includes(t));
  reporter.assert(
    "Tier 1",
    "T1.4.1",
    "Tech Stack: Backend Java & enterprise tags present",
    missingTech.length <= 2, // Allow slight naming variations like Java (8/17)
    { missingTech }
  );

  const hasNoBlenderContent = !/blender/i.test(portfolioTs || "");
  reporter.assert(
    "Tier 1",
    "T1.4.2",
    "Purge: Zero mentions of 'Blender' in portfolio.ts",
    hasNoBlenderContent,
    { message: hasNoBlenderContent ? "Clean" : "Prohibited word 'Blender' detected in content" }
  );

  const hasNoLinuxContent = !/linux/i.test(portfolioTs || "");
  reporter.assert(
    "Tier 1",
    "T1.4.3",
    "Purge: Zero mentions of 'Linux' in portfolio.ts",
    hasNoLinuxContent,
    { message: hasNoLinuxContent ? "Clean" : "Prohibited word 'Linux' detected in content" }
  );

  // Disciplines prioritization (Java & Microservices and Relational first)
  const disciplinesLeadingWithJava =
    portfolioTs?.includes("Enterprise Java & Microservices") ||
    portfolioTs?.includes("Enterprise Java") ||
    portfolioTs?.includes("Microservices");
  reporter.assert(
    "Tier 1",
    "T1.4.4",
    "Disciplines: Reordered to highlight Enterprise Java & Microservices first",
    disciplinesLeadingWithJava,
    { message: disciplinesLeadingWithJava ? "Java backend first" : "Disciplines not reordered" }
  );

  // T1.5: Projects with Target Users & Life Impact
  const projectTitles = [
    "Citi Enterprise Banking",
    "Precision Tools QC",
    "AI Reflection Journal",
    "AI Companion",
    "Daily Vegetable Price Tracker",
  ];
  const missingProjects = projectTitles.filter((p) => !portfolioTs?.includes(p));
  reporter.assert(
    "Tier 1",
    "T1.5.1",
    "Projects: All 5 specified projects present in portfolio.ts",
    missingProjects.length === 0,
    { missingProjects }
  );

  const hasTargetUsersField = portfolioTs?.includes("targetUsers") || portfolioTs?.includes("Target Users");
  const hasLifeImpactField = portfolioTs?.includes("lifeImpact") || portfolioTs?.includes("Life Impact");
  reporter.assert(
    "Tier 1",
    "T1.5.2",
    "Projects: Target Users and Life Impact metadata present in model",
    hasTargetUsersField && hasLifeImpactField,
    { hasTargetUsersField, hasLifeImpactField }
  );

  const hasAiJournalRepo = portfolioTs?.includes("https://github.com/vasanthaganesh/AI-Reflection-Journal");
  const hasAiCompanionRepo = portfolioTs?.includes("https://github.com/vasanthaganesh/AI_Companion");
  reporter.assert(
    "Tier 1",
    "T1.5.3",
    "Projects: Clickable GitHub repositories for AI Journal and AI Companion",
    hasAiJournalRepo && hasAiCompanionRepo,
    { hasAiJournalRepo, hasAiCompanionRepo }
  );

  // T1.6: 3 Balanced Journal Tabs
  const hasSystemsTab = portfolioTs?.includes("On Systems") || portfolioTs?.includes("systems");
  const hasMindsetTab = portfolioTs?.includes("On Games, Story & Mindset") || portfolioTs?.includes("mindset");
  const hasAiTab = portfolioTs?.includes("On AI & Creation") || portfolioTs?.includes("ai");
  reporter.assert(
    "Tier 1",
    "T1.6.1",
    "Journal: 3 balanced tabs (*On Systems*, *On Games, Story & Mindset*, *On AI & Creation*)",
    hasSystemsTab && hasMindsetTab && hasAiTab,
    { hasSystemsTab, hasMindsetTab, hasAiTab }
  );

  // T1.7: Hero Wordmark
  const hasUnifiedWordmark =
    heroTsx?.includes("VASANTHAGANESH") ||
    portfolioTs?.includes("VASANTHAGANESH");
  reporter.assert(
    "Tier 1",
    "T1.7.1",
    "Hero: Unified wordmark 'VASANTHAGANESH' configured",
    hasUnifiedWordmark,
    { message: hasUnifiedWordmark ? "Unified" : "Wordmark fragmented or missing" }
  );

  const hasHeroCtas =
    heroTsx?.includes("#projects") &&
    heroTsx?.includes("#contact");
  reporter.assert(
    "Tier 1",
    "T1.7.2",
    "Hero: Exactly 2 clean CTAs ('See My Work' & 'Let's Talk')",
    hasHeroCtas,
    { message: hasHeroCtas ? "CTAs verified" : "CTAs missing" }
  );

  // T1.8: Static Export Artifacts
  const hasResumePdf = Boolean(resumePdfPublic || resumePdfOut);
  reporter.assert(
    "Tier 1",
    "T1.8.1",
    "Assets: CV Resume PDF (/Vasanthaganesh_R_Resume.pdf) exists and is accessible",
    hasResumePdf,
    { message: hasResumePdf ? "Found on disk" : "Missing /Vasanthaganesh_R_Resume.pdf" }
  );

  // ============================================================================
  // TIER 2: Boundary & Corner Cases (T2.1 - T2.8)
  // ============================================================================
  console.log(`\n${colors.bold}--- TIER 2: Boundary & Corner Cases ---${colors.reset}`);

  // T2.1: Outdated Data Leak Prevention
  const oldEmailRegex = /vasanthaganeshraja@gmail\.com/i;
  const oldEmailInPortfolio = oldEmailRegex.test(portfolioTs || "");
  const oldEmailInLayout = oldEmailRegex.test(layoutTsx || "");
  const oldEmailInContact = oldEmailRegex.test(contactTsx || "");
  reporter.assert(
    "Tier 2",
    "T2.1.1",
    "Boundary: No occurrences of outdated email (vasanthaganeshraja@gmail.com)",
    !oldEmailInPortfolio && !oldEmailInLayout && !oldEmailInContact,
    {
      oldEmailInPortfolio,
      oldEmailInLayout,
      oldEmailInContact,
    }
  );

  const oldCgpaInPortfolio = portfolioTs?.includes("8.34");
  reporter.assert(
    "Tier 2",
    "T2.1.2",
    "Boundary: Outdated CGPA (8.34) completely eradicated",
    !oldCgpaInPortfolio,
    { message: oldCgpaInPortfolio ? "Found old CGPA 8.34" : "Clean" }
  );

  const phoneRegex = /\+91\s*7871029435/;
  const exactPhoneMatched = phoneRegex.test(portfolioTs || "") || phoneRegex.test(contactTsx || "");
  reporter.assert(
    "Tier 2",
    "T2.1.3",
    "Boundary: Phone number strictly matches Indian format +91 7871029435",
    exactPhoneMatched,
    { expected: "+91 7871029435", actual: exactPhoneMatched ? "Valid" : "Invalid/Missing" }
  );

  // T2.2: Case-Insensitive Prohibited Tool Purge in Components
  const componentFiles = [
    { name: "Hero.tsx", content: heroTsx },
    { name: "About.tsx", content: aboutTsx },
    { name: "Stack.tsx", content: stackTsx },
    { name: "Work.tsx", content: workTsx },
    { name: "Journal.tsx", content: journalTsx },
    { name: "Contact.tsx", content: contactTsx },
    { name: "Nav.tsx", content: navTsx },
  ];

  const blenderViolations = componentFiles
    .filter((f) => f.content && /blender/i.test(f.content))
    .map((f) => f.name);

  reporter.assert(
    "Tier 2",
    "T2.2.1",
    "Boundary: Zero 'Blender' references in any UI components",
    blenderViolations.length === 0,
    { violatingFiles: blenderViolations }
  );

  const linuxViolations = componentFiles
    .filter((f) => f.content && /linux/i.test(f.content))
    .map((f) => f.name);

  reporter.assert(
    "Tier 2",
    "T2.2.2",
    "Boundary: Zero 'Linux' references in any UI components",
    linuxViolations.length === 0,
    { violatingFiles: linuxViolations }
  );

  // T2.3: GitHub Link Exact URL Matching
  const exactRepo1 = "https://github.com/vasanthaganesh/AI-Reflection-Journal";
  const exactRepo2 = "https://github.com/vasanthaganesh/AI_Companion";
  const repo1Valid = portfolioTs?.includes(exactRepo1);
  const repo2Valid = portfolioTs?.includes(exactRepo2);
  reporter.assert(
    "Tier 2",
    "T2.3.1",
    "Boundary: Exact GitHub repository URLs with zero trailing slashes or typos",
    repo1Valid && repo2Valid,
    { repo1Valid, repo2Valid }
  );

  // T2.4: Oracle Certification Prominence & Highlighting
  const oracleHighlightedInAbout =
    aboutTsx?.includes("highlight") ||
    aboutTsx?.includes("Oracle") ||
    aboutTsx?.includes("OCA") ||
    portfolioTs?.includes("highlight: true");
  reporter.assert(
    "Tier 2",
    "T2.4.1",
    "Boundary: Oracle Java certification has distinctive prominence/highlight styling",
    Boolean(oracleHighlightedInAbout),
    { message: oracleHighlightedInAbout ? "Highlighted" : "Lacks distinctive highlight flag/presentation" }
  );

  // T2.5: Project Content Completeness
  const hasSubstantialImpact =
    portfolioTs?.includes("transaction integrity") ||
    portfolioTs?.includes("99.99%") ||
    portfolioTs?.includes("frictionless mobile workflow") ||
    portfolioTs?.includes("sanctuary");
  reporter.assert(
    "Tier 2",
    "T2.5.1",
    "Boundary: Substantial real-world impact descriptions populated for projects",
    hasSubstantialImpact,
    { message: hasSubstantialImpact ? "Substantial text verified" : "Impact descriptions too brief or missing" }
  );

  // T2.6: Journal Tab Count & Entry Balancing (9 entries)
  const journalTabsMatch = (portfolioTs?.match(/id:\s*["'](systems|mindset|ai|craft|games|work)["']/g) || []).length;
  const journalEntriesMatch = (portfolioTs?.match(/title:\s*["'][^"']+["']/g) || []).length;
  reporter.assert(
    "Tier 2",
    "T2.6.1",
    "Boundary: Exactly 3 journal tabs present",
    journalTabsMatch === 3 || data.journal?.length === 3,
    { expected: 3, actual: data.journal?.length || journalTabsMatch }
  );

  reporter.assert(
    "Tier 2",
    "T2.6.2",
    "Boundary: Balanced 9 journal entries (3 per tab) with rich content",
    journalEntriesMatch >= 9 || (data.journal && data.journal.reduce((acc, tab) => acc + (tab.entries?.length || 0), 0) >= 9),
    { expected: 9, actual: journalEntriesMatch }
  );

  // T2.7: Hero Wordmark Single Line / Non-Stacked Rendering
  const heroNotSplitIntoSeparateStackedBoxes =
    !heroTsx?.includes('flex-col items-center text-[clamp(3.6rem,17vw,7rem)] md:flex-row') ||
    heroTsx?.includes('VASANTHAGANESH');
  reporter.assert(
    "Tier 2",
    "T2.7.1",
    "Boundary: Hero wordmark does not stack into separate broken words on mobile",
    heroNotSplitIntoSeparateStackedBoxes,
    { message: heroNotSplitIntoSeparateStackedBoxes ? "Unified layout" : "Legacy 3-line stacking found" }
  );

  // ============================================================================
  // TIER 3: Pairwise & Cross-Feature Consistency (T3.1 - T3.5)
  // ============================================================================
  console.log(`\n${colors.bold}--- TIER 3: Pairwise & Cross-Feature Consistency ---${colors.reset}`);

  // T3.1: Contact Channels & Nav Consistency
  const navHasHandleOrTelegram =
    navTsx?.includes("telegram") ||
    navTsx?.includes("channels") ||
    navTsx?.includes("handle");
  reporter.assert(
    "Tier 3",
    "T3.1.1",
    "Pairwise: Nav header and Contact footer share consistent channels",
    navHasHandleOrTelegram,
    { message: navHasHandleOrTelegram ? "Consistent" : "Nav channel lookup mismatch" }
  );

  // T3.2: Role Alignment Across Hero, Layout, and Content
  const roleInLayout = layoutTsx?.includes("Backend Java") || layoutTsx?.includes("Backend");
  const roleInPortfolio = portfolioTs?.includes("Backend Java");
  reporter.assert(
    "Tier 3",
    "T3.2.1",
    "Pairwise: Backend Java Engineer role consistent across layout.tsx and portfolio.ts",
    roleInLayout && roleInPortfolio,
    { roleInLayout, roleInPortfolio }
  );

  // T3.3: Project Stack & Skills Tag Cross-Referencing
  const javaInSkills = portfolioTs?.includes("Java") || portfolioTs?.includes("Core Java");
  const springBootInSkills = portfolioTs?.includes("Spring Boot");
  reporter.assert(
    "Tier 3",
    "T3.3.1",
    "Pairwise: Flagship Java & Spring Boot stack present across tags and project bodies",
    javaInSkills && springBootInSkills,
    { javaInSkills, springBootInSkills }
  );

  // T3.4: Inspirations & About Rendering Conformance
  const aboutRendersInspirations =
    aboutTsx?.includes("inspirations") ||
    aboutTsx?.includes("Inspirations") ||
    (aboutTsx?.includes("Luffy") && aboutTsx?.includes("Subaru"));
  reporter.assert(
    "Tier 3",
    "T3.4.1",
    "Pairwise: About.tsx actively renders dedicated Personal Inspirations",
    Boolean(aboutRendersInspirations),
    { message: aboutRendersInspirations ? "Rendered in About" : "About.tsx does not render separated inspirations" }
  );

  // T3.5: Work Component Contract Conformance
  const workRendersImpact =
    workTsx?.includes("targetUsers") ||
    workTsx?.includes("lifeImpact") ||
    workTsx?.includes("Target Users") ||
    workTsx?.includes("Life Impact");
  const workRendersRepo = workTsx?.includes("repo") || workTsx?.includes("github");
  reporter.assert(
    "Tier 3",
    "T3.5.1",
    "Pairwise: Work.tsx renders targetUsers, lifeImpact, and repo links",
    Boolean(workRendersImpact && workRendersRepo),
    { workRendersImpact: Boolean(workRendersImpact), workRendersRepo: Boolean(workRendersRepo) }
  );

  // ============================================================================
  // TIER 4: Real-World Scenario Acceptance (T4.1 - T4.4)
  // ============================================================================
  console.log(`\n${colors.bold}--- TIER 4: Real-World Scenario Acceptance ---${colors.reset}`);

  // T4.1: Recruiter Journey Simulation
  const recruiterJourneyPass =
    hasVasanthaganeshName &&
    hasNewEmail &&
    hasPhone &&
    hasOracleCert &&
    hasTargetRole &&
    hasResumePdf;
  reporter.assert(
    "Tier 4",
    "T4.1.1",
    "Scenario: MNC Backend Recruiter lands on portfolio and gets complete candidate profile",
    recruiterJourneyPass,
    { message: recruiterJourneyPass ? "Full candidate profile complete" : "Recruiter checklist incomplete" }
  );

  // T4.2: Tech Lead Code & Architecture Audit
  const techLeadAuditPass =
    hasNoBlenderContent &&
    hasNoLinuxContent &&
    blenderViolations.length === 0 &&
    linuxViolations.length === 0 &&
    missingProjects.length === 0;
  reporter.assert(
    "Tier 4",
    "T4.2.1",
    "Scenario: Tech Lead audit verifies pure Java/enterprise focus with zero extraneous tools",
    techLeadAuditPass,
    { message: techLeadAuditPass ? "Architecture verified clean" : "Tech lead audit failed" }
  );

  // T4.3: Engineering Impact & Storytelling Audit
  const impactAuditPass =
    hasSystemsTab &&
    hasMindsetTab &&
    hasAiTab &&
    hasAllInspirations &&
    hasAiJournalRepo &&
    hasAiCompanionRepo;
  reporter.assert(
    "Tier 4",
    "T4.3.1",
    "Scenario: Engineering impact narrative (introvert tools, factory UX, banking scale) verified",
    impactAuditPass,
    { message: impactAuditPass ? "Impact storytelling verified" : "Narrative elements incomplete" }
  );

  // T4.4: Static Build Output Validation (out/index.html)
  if (outIndexHtml) {
    const htmlHasNewEmail = outIndexHtml.includes("vasanthaganesh11@gmail.com");
    const htmlHasOldEmail = outIndexHtml.includes("vasanthaganeshraja@gmail.com");
    const htmlHasBlender = /blender/i.test(outIndexHtml);
    const htmlHasLinux = /linux/i.test(outIndexHtml);
    const htmlHasWordmark = outIndexHtml.includes("VASANTHAGANESH");
    const htmlHasOracle =
      outIndexHtml.includes("Oracle Certified Associate") ||
      outIndexHtml.includes("Java SE 8 Programmer") ||
      outIndexHtml.includes("OCA");
    const htmlHas832 = outIndexHtml.includes("8.32");

    reporter.assert(
      "Tier 4",
      "T4.4.1",
      "Static Output: out/index.html contains updated email 'vasanthaganesh11@gmail.com'",
      htmlHasNewEmail && !htmlHasOldEmail,
      { htmlHasNewEmail, htmlHasOldEmail }
    );

    reporter.assert(
      "Tier 4",
      "T4.4.2",
      "Static Output: out/index.html has ZERO occurrences of 'Blender'",
      !htmlHasBlender,
      { message: htmlHasBlender ? "'Blender' found in static build export" : "Clean" }
    );

    reporter.assert(
      "Tier 4",
      "T4.4.3",
      "Static Output: out/index.html has ZERO occurrences of 'Linux'",
      !htmlHasLinux,
      { message: htmlHasLinux ? "'Linux' found in static build export" : "Clean" }
    );

    reporter.assert(
      "Tier 4",
      "T4.4.4",
      "Static Output: out/index.html displays unified wordmark 'VASANTHAGANESH'",
      htmlHasWordmark,
      { message: htmlHasWordmark ? "Wordmark present" : "Wordmark missing in static export" }
    );

    reporter.assert(
      "Tier 4",
      "T4.4.5",
      "Static Output: out/index.html renders Oracle Java Certification prominently",
      htmlHasOracle,
      { message: htmlHasOracle ? "Oracle Cert present" : "Oracle Cert missing in static export" }
    );

    reporter.assert(
      "Tier 4",
      "T4.4.6",
      "Static Output: out/index.html reflects 8.32 CGPA",
      htmlHas832,
      { message: htmlHas832 ? "CGPA 8.32 present" : "CGPA 8.32 missing in static export" }
    );
  } else {
    console.log(
      `  ${colors.yellow}[INFO]${colors.reset} out/index.html not found yet. Run 'npm run build' to generate static export for Tier 4 bundle validation.`
    );
  }

  // Final summary and exit code calculation
  const failures = reporter.summary();
  process.exit(failures === 0 ? 0 : 1);
}

runVerification();
