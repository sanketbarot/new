// ================================================
// AI ToolCor Calculator - Tools Data (70 Tools)
// ================================================

const ALL_TOOLS = [
    // ===== FINANCE (20) =====
    { id: 1, name: 'EMI Calculator', slug: 'emi-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-calculator', active: true, popular: true, isNew: false, desc: 'Calculate monthly EMI for home, car or personal loans instantly.' },
    { id: 2, name: 'SIP Calculator', slug: 'sip-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-chart-line', active: true, popular: true, isNew: false, desc: 'Calculate returns on your monthly SIP investments.' },
    { id: 3, name: 'Lumpsum Calculator', slug: 'lumpsum-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-coins', active: true, popular: false, isNew: false, desc: 'Calculate returns on one-time lumpsum investments.' },
    { id: 4, name: 'GST Calculator', slug: 'gst-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-receipt', active: true, popular: true, isNew: false, desc: 'Calculate GST amount and total price with ease.' },
    { id: 5, name: 'Income Tax Calculator', slug: 'income-tax-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-file-invoice', active: true, popular: true, isNew: false, desc: 'Estimate income tax based on salary and deductions.' },
    { id: 6, name: 'FD Calculator', slug: 'fd-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-piggy-bank', active: true, popular: false, isNew: false, desc: 'Calculate Fixed Deposit maturity amount and interest.' },
    { id: 7, name: 'RD Calculator', slug: 'rd-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-piggy-bank', active: true, popular: false, isNew: false, desc: 'Calculate Recurring Deposit maturity amount.' },
    { id: 8, name: 'PPF Calculator', slug: 'ppf-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-landmark', active: true, popular: false, isNew: false, desc: 'Calculate PPF returns and maturity amount.' },
    { id: 9, name: 'NPS Calculator', slug: 'nps-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-umbrella', active: true, popular: false, isNew: false, desc: 'Calculate National Pension Scheme returns.' },
    { id: 10, name: 'EPF Calculator', slug: 'epf-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-briefcase', active: true, popular: false, isNew: false, desc: 'Calculate Employee Provident Fund corpus.' },
    { id: 11, name: 'HRA Calculator', slug: 'hra-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-house', active: true, popular: false, isNew: false, desc: 'Calculate House Rent Allowance exemption.' },
    { id: 12, name: 'Gratuity Calculator', slug: 'gratuity-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-hand-holding-dollar', active: true, popular: false, isNew: false, desc: 'Calculate gratuity based on salary and tenure.' },
    { id: 13, name: 'Compound Interest Calculator', slug: 'compound-interest-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-percent', active: true, popular: false, isNew: false, desc: 'Calculate compound interest for any investment.' },
    { id: 14, name: 'Simple Interest Calculator', slug: 'simple-interest-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-percent', active: true, popular: false, isNew: false, desc: 'Calculate simple interest quickly.' },
    { id: 15, name: 'Loan Calculator', slug: 'loan-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-money-bill-wave', active: true, popular: true, isNew: false, desc: 'Calculate loan repayment schedule and total cost.' },
    { id: 16, name: 'Discount Calculator', slug: 'discount-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-tag', active: true, popular: false, isNew: false, desc: 'Calculate discounted price and savings.' },
    { id: 17, name: 'Inflation Calculator', slug: 'inflation-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-arrow-trend-up', active: true, popular: false, isNew: false, desc: 'Calculate the impact of inflation on money.' },
    { id: 18, name: 'Retirement Calculator', slug: 'retirement-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-chair', active: true, popular: false, isNew: false, desc: 'Plan your retirement corpus and savings.' },
    { id: 19, name: 'Mutual Fund Returns Calculator', slug: 'mutual-fund-returns-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-chart-pie', active: true, popular: false, isNew: false, desc: 'Calculate returns on mutual fund investments.' },
    { id: 20, name: 'Credit Card Interest Calculator', slug: 'credit-card-interest-calculator', cat: 'finance', color: 'green', icon: 'fa-solid fa-credit-card', active: true, popular: false, isNew: false, desc: 'Calculate credit card interest and outstanding dues.' },

    // ===== HEALTH (10) =====
    { id: 21, name: 'BMI Calculator', slug: 'bmi-calculator', cat: 'health', color: 'pink', icon: 'fa-solid fa-weight-scale', active: true, popular: true, isNew: false, desc: 'Calculate your Body Mass Index instantly.' },
    { id: 22, name: 'BMR Calculator', slug: 'bmr-calculator', cat: 'health', color: 'pink', icon: 'fa-solid fa-fire', active: true, popular: false, isNew: false, desc: 'Calculate Basal Metabolic Rate and daily calorie needs.' },
    { id: 23, name: 'Calories Burned Calculator', slug: 'calories-burned-calculator', cat: 'health', color: 'pink', icon: 'fa-solid fa-person-running', active: true, popular: false, isNew: false, desc: 'Calculate calories burned during exercise.' },
    { id: 24, name: 'Water Intake Calculator', slug: 'water-intake-calculator', cat: 'health', color: 'pink', icon: 'fa-solid fa-droplet', active: true, popular: false, isNew: false, desc: 'Calculate daily water intake based on weight.' },
    { id: 25, name: 'Body Fat Calculator', slug: 'body-fat-calculator', cat: 'health', color: 'pink', icon: 'fa-solid fa-dumbbell', active: true, popular: false, isNew: false, desc: 'Estimate your body fat percentage.' },
    { id: 26, name: 'Ideal Weight Calculator', slug: 'ideal-weight-calculator', cat: 'health', color: 'pink', icon: 'fa-solid fa-scale-balanced', active: true, popular: false, isNew: false, desc: 'Find your ideal body weight based on height.' },
    { id: 27, name: 'Pregnancy Due Date Calculator', slug: 'pregnancy-due-date-calculator', cat: 'health', color: 'pink', icon: 'fa-solid fa-baby', active: true, popular: false, isNew: false, desc: 'Calculate expected due date of pregnancy.' },
    { id: 28, name: 'Ovulation Calculator', slug: 'ovulation-calculator', cat: 'health', color: 'pink', icon: 'fa-solid fa-calendar-days', active: true, popular: false, isNew: false, desc: 'Find your ovulation and fertile window dates.' },
    { id: 29, name: 'Macro Calculator', slug: 'macro-calculator', cat: 'health', color: 'pink', icon: 'fa-solid fa-bowl-food', active: true, popular: false, isNew: false, desc: 'Calculate daily macronutrient needs.' },
    { id: 30, name: 'Heart Rate Calculator', slug: 'heart-rate-calculator', cat: 'health', color: 'pink', icon: 'fa-solid fa-heart-pulse', active: true, popular: false, isNew: false, desc: 'Calculate target heart rate zones for exercise.' },

    // ===== BUSINESS (8) =====
    { id: 31, name: 'Profit Margin Calculator', slug: 'profit-margin-calculator', cat: 'business', color: 'blue', icon: 'fa-solid fa-chart-line', active: true, popular: true, isNew: false, desc: 'Calculate profit margin and net profit easily.' },
    { id: 32, name: 'Salary Calculator', slug: 'salary-calculator', cat: 'business', color: 'blue', icon: 'fa-solid fa-money-check', active: true, popular: true, isNew: false, desc: 'Calculate take-home salary after deductions.' },
    { id: 33, name: 'ROI Calculator', slug: 'roi-calculator', cat: 'business', color: 'blue', icon: 'fa-solid fa-arrow-trend-up', active: true, popular: false, isNew: false, desc: 'Calculate Return on Investment for any project.' },
    { id: 34, name: 'Break Even Calculator', slug: 'break-even-calculator', cat: 'business', color: 'blue', icon: 'fa-solid fa-scale-unbalanced', active: true, popular: false, isNew: false, desc: 'Find your break-even point for business.' },
    { id: 35, name: 'Markup Calculator', slug: 'markup-calculator', cat: 'business', color: 'blue', icon: 'fa-solid fa-tags', active: true, popular: false, isNew: false, desc: 'Calculate product markup and selling price.' },
    { id: 36, name: 'CAGR Calculator', slug: 'cagr-calculator', cat: 'business', color: 'blue', icon: 'fa-solid fa-chart-bar', active: true, popular: false, isNew: false, desc: 'Calculate Compound Annual Growth Rate.' },
    { id: 37, name: 'Sales Tax Calculator', slug: 'sales-tax-calculator', cat: 'business', color: 'blue', icon: 'fa-solid fa-file-invoice-dollar', active: true, popular: false, isNew: false, desc: 'Calculate sales tax on products and services.' },
    { id: 38, name: 'Freelance Rate Calculator', slug: 'freelance-rate-calculator', cat: 'business', color: 'blue', icon: 'fa-solid fa-laptop', active: true, popular: false, isNew: true, desc: 'Calculate your ideal freelance hourly rate.' },

    // ===== DAILY USE (10) =====
    { id: 39, name: 'Age Calculator', slug: 'age-calculator', cat: 'daily-use', color: 'peach', icon: 'fa-solid fa-cake-candles', active: true, popular: true, isNew: false, desc: 'Calculate exact age in years, months and days.' },
    { id: 40, name: 'Percentage Calculator', slug: 'percentage-calculator', cat: 'daily-use', color: 'peach', icon: 'fa-solid fa-percent', active: true, popular: true, isNew: false, desc: 'Calculate percentages quickly and easily.' },
    { id: 41, name: 'Date Difference Calculator', slug: 'date-difference-calculator', cat: 'daily-use', color: 'peach', icon: 'fa-solid fa-calendar', active: true, popular: false, isNew: false, desc: 'Calculate difference between two dates.' },
    { id: 42, name: 'Tip Calculator', slug: 'tip-calculator', cat: 'daily-use', color: 'peach', icon: 'fa-solid fa-utensils', active: true, popular: false, isNew: false, desc: 'Calculate tip amount and split bills easily.' },
    { id: 43, name: 'Time Calculator', slug: 'time-calculator', cat: 'daily-use', color: 'peach', icon: 'fa-solid fa-clock', active: true, popular: false, isNew: false, desc: 'Add or subtract time values easily.' },
    { id: 44, name: 'Unit Converter', slug: 'unit-converter', cat: 'daily-use', color: 'peach', icon: 'fa-solid fa-right-left', active: true, popular: true, isNew: false, desc: 'Convert between different units of measurement.' },
    { id: 45, name: 'Fuel Cost Calculator', slug: 'fuel-cost-calculator', cat: 'daily-use', color: 'peach', icon: 'fa-solid fa-gas-pump', active: true, popular: false, isNew: false, desc: 'Calculate fuel cost for your trip.' },
    { id: 46, name: 'Mileage Calculator', slug: 'mileage-calculator', cat: 'daily-use', color: 'peach', icon: 'fa-solid fa-car', active: true, popular: false, isNew: false, desc: 'Calculate vehicle mileage and fuel efficiency.' },
    { id: 47, name: 'Speed Calculator', slug: 'speed-calculator', cat: 'daily-use', color: 'peach', icon: 'fa-solid fa-gauge-high', active: true, popular: false, isNew: false, desc: 'Calculate speed, distance or time.' },
    { id: 48, name: 'Cooking Converter', slug: 'cooking-converter', cat: 'daily-use', color: 'peach', icon: 'fa-solid fa-kitchen-set', active: true, popular: false, isNew: true, desc: 'Convert cooking measurements and units.' },

    // ===== EDUCATION (6) =====
    { id: 49, name: 'GPA Calculator', slug: 'gpa-calculator', cat: 'education', color: 'purple', icon: 'fa-solid fa-graduation-cap', active: true, popular: true, isNew: false, desc: 'Calculate your GPA based on grades and credits.' },
    { id: 50, name: 'CGPA Calculator', slug: 'cgpa-calculator', cat: 'education', color: 'purple', icon: 'fa-solid fa-graduation-cap', active: true, popular: false, isNew: false, desc: 'Calculate cumulative GPA across all semesters.' },
    { id: 51, name: 'Marks Percentage Calculator', slug: 'marks-percentage-calculator', cat: 'education', color: 'purple', icon: 'fa-solid fa-star', active: true, popular: true, isNew: false, desc: 'Calculate percentage from marks obtained.' },
    { id: 52, name: 'Grade Calculator', slug: 'grade-calculator', cat: 'education', color: 'purple', icon: 'fa-solid fa-a', active: true, popular: false, isNew: false, desc: 'Calculate final grade based on assignments and exams.' },
    { id: 53, name: 'Attendance Calculator', slug: 'attendance-calculator', cat: 'education', color: 'purple', icon: 'fa-solid fa-clipboard-check', active: true, popular: false, isNew: false, desc: 'Calculate attendance percentage for school or college.' },
    { id: 54, name: 'Exam Score Calculator', slug: 'exam-score-calculator', cat: 'education', color: 'purple', icon: 'fa-solid fa-file-pen', active: true, popular: false, isNew: false, desc: 'Calculate exam score and rank estimate.' },

    // ===== MATH (8) =====
    { id: 55, name: 'Scientific Calculator', slug: 'scientific-calculator', cat: 'math', color: 'yellow', icon: 'fa-solid fa-square-root-variable', active: true, popular: true, isNew: false, desc: 'Perform advanced scientific calculations.' },
    { id: 56, name: 'Fraction Calculator', slug: 'fraction-calculator', cat: 'math', color: 'yellow', icon: 'fa-solid fa-divide', active: true, popular: false, isNew: false, desc: 'Add, subtract, multiply and divide fractions.' },
    { id: 57, name: 'LCM & HCF Calculator', slug: 'lcm-hcf-calculator', cat: 'math', color: 'yellow', icon: 'fa-solid fa-calculator', active: true, popular: false, isNew: false, desc: 'Find LCM and HCF of any numbers.' },
    { id: 58, name: 'Square Root Calculator', slug: 'square-root-calculator', cat: 'math', color: 'yellow', icon: 'fa-solid fa-square-root-variable', active: true, popular: false, isNew: false, desc: 'Calculate square root and cube root.' },
    { id: 59, name: 'Power Calculator', slug: 'power-calculator', cat: 'math', color: 'yellow', icon: 'fa-solid fa-superscript', active: true, popular: false, isNew: false, desc: 'Calculate power and exponent of numbers.' },
    { id: 60, name: 'Logarithm Calculator', slug: 'logarithm-calculator', cat: 'math', color: 'yellow', icon: 'fa-solid fa-wave-square', active: true, popular: false, isNew: false, desc: 'Calculate logarithm for any base.' },
    { id: 61, name: 'Quadratic Equation Solver', slug: 'quadratic-equation-solver', cat: 'math', color: 'yellow', icon: 'fa-solid fa-x', active: true, popular: false, isNew: false, desc: 'Solve quadratic equations step by step.' },
    { id: 62, name: 'Probability Calculator', slug: 'probability-calculator', cat: 'math', color: 'yellow', icon: 'fa-solid fa-dice', active: true, popular: false, isNew: false, desc: 'Calculate probability of events.' },

    // ===== UTILITY (8) =====
    { id: 63, name: 'Password Generator', slug: 'password-generator', cat: 'utility', color: 'blue', icon: 'fa-solid fa-key', active: true, popular: true, isNew: false, desc: 'Generate strong and secure passwords.' },
    { id: 64, name: 'Random Number Generator', slug: 'random-number-generator', cat: 'utility', color: 'blue', icon: 'fa-solid fa-dice', active: true, popular: false, isNew: false, desc: 'Generate random numbers in any range.' },
    { id: 65, name: 'Word Counter', slug: 'word-counter', cat: 'utility', color: 'blue', icon: 'fa-solid fa-align-left', active: true, popular: true, isNew: false, desc: 'Count words, characters and sentences.' },
    { id: 66, name: 'Character Counter', slug: 'character-counter', cat: 'utility', color: 'blue', icon: 'fa-solid fa-font', active: true, popular: false, isNew: false, desc: 'Count characters with and without spaces.' },

    { id: 67, name: 'Time Zone Converter', slug: 'time-zone-converter', cat: 'utility', color: 'blue', icon: 'fa-solid fa-earth-asia', active: true, popular: false, isNew: false, desc: 'Convert time across different time zones.' },
    { id: 68, name: 'QR Code Generator', slug: 'qr-code-generator', cat: 'utility', color: 'blue', icon: 'fa-solid fa-qrcode', active: true, popular: true, isNew: false, desc: 'Generate QR codes for any text or URL.' },
    { id: 69, name: 'Color Code Converter', slug: 'color-code-converter', cat: 'utility', color: 'blue', icon: 'fa-solid fa-palette', active: true, popular: false, isNew: true, desc: 'Convert between HEX, RGB and HSL color codes.' }
];

// ===== Helper Functions =====
function getToolsByCategory(cat) {
    return ALL_TOOLS.filter(t => t.cat === cat);
}

function getPopularTools() {
    return ALL_TOOLS.filter(t => t.popular);
}

function getNewTools() {
    return ALL_TOOLS.filter(t => t.isNew);
}

function searchTools(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return ALL_TOOLS.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.cat.toLowerCase().includes(q)
    );
}

function getToolBySlug(slug) {
    return ALL_TOOLS.find(t => t.slug === slug);
}

function toolCardHTML(tool) {
    const badge = tool.popular
        ? '<span class="tool-badge popular">🔥 Popular</span>'
        : tool.isNew
            ? '<span class="tool-badge new">✨ New</span>'
            : '<span></span>';

    return `
        <a href="pages/${tool.cat}/${tool.slug}.html"
           class="tool-card"
           title="${tool.name} - AI ToolCor Calculator"
           aria-label="${tool.name}">
            <div class="tool-card-icon ${tool.color}">
                <i class="${tool.icon}" aria-hidden="true"></i>
            </div>
            <div class="tool-card-name">${tool.name}</div>
            <div class="tool-card-desc">${tool.desc}</div>
            <div class="tool-card-footer">
                ${badge}
                <div class="tool-card-arrow">
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </div>
            </div>
        </a>`;
}

console.log(`📊 ${ALL_TOOLS.length} tools loaded`);