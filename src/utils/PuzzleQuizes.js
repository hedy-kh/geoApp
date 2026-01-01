// utils/PuzzleQuizes.js

// Extended puzzle pieces data for multiple countries
export const PuzzleArray = [
  // North Africa
  {
    id: "morocco",
    name: "المغرب",
    flag: "🇲🇦",
    color: "#C91432",
    correctPosition: { x: 0, y: 0 },
    facts: "عاصمتها الرباط",
    category: "شمال أفريقيا",
  },
  {
    id: "algeria",
    name: "الجزائر",
    flag: "🇩🇿",
    color: "#006233",
    correctPosition: { x: 1, y: 0 },
    facts: "أكبر دولة في أفريقيا",
    category: "شمال أفريقيا",
  },
  {
    id: "tunisia",
    name: "تونس",
    flag: "🇹🇳",
    color: "#E70013",
    correctPosition: { x: 2, y: 0 },
    facts: "عاصمتها تونس",
    category: "شمال أفريقيا",
  },
  {
    id: "libya",
    name: "ليبيا",
    flag: "🇱🇾",
    color: "#239E46",
    correctPosition: { x: 0, y: 1 },
    facts: "لديها ساحل على البحر المتوسط",
    category: "شمال أفريقيا",
  },
  {
    id: "mauritania",
    name: "موريتانيا",
    flag: "🇲🇷",
    color: "#006233",
    correctPosition: { x: 1, y: 1 },
    facts: "عاصمتها نواكشوط",
    category: "شمال أفريقيا",
  },

  // Middle East Countries
  {
    id: "saudi_arabia",
    name: "السعودية",
    flag: "🇸🇦",
    color: "#006233",
    correctPosition: { x: 0, y: 0 },
    facts: "موطن الحرمين الشريفين",
    category: "الشرق الأوسط",
  },
  {
    id: "egypt",
    name: "مصر",
    flag: "🇪🇬",
    color: "#C8102E",
    correctPosition: { x: 1, y: 0 },
    facts: "أكبر دولة عربية من حيث السكان",
    category: "الشرق الأوسط",
  },
  {
    id: "uae",
    name: "الإمارات",
    flag: "🇦🇪",
    color: "#C8102E",
    correctPosition: { x: 2, y: 0 },
    facts: "عاصمتها أبوظبي",
    category: "الشرق الأوسط",
  },
  {
    id: "qatar",
    name: "قطر",
    flag: "🇶🇦",
    color: "#8A1538",
    correctPosition: { x: 0, y: 1 },
    facts: "استضافت كأس العالم 2022",
    category: "الشرق الأوسط",
  },
  {
    id: "jordan",
    name: "الأردن",
    flag: "🇯🇴",
    color: "#007A3D",
    correctPosition: { x: 1, y: 1 },
    facts: "تضم مدينة البتراء الأثرية",
    category: "الشرق الأوسط",
  },
  {
    id: "lebanon",
    name: "لبنان",
    flag: "🇱🇧",
    color: "#C8102E",
    correctPosition: { x: 2, y: 1 },
    facts: "عاصمتها بيروت",
    category: "الشرق الأوسط",
  },
  {
    id: "iraq",
    name: "العراق",
    flag: "🇮🇶",
    color: "#C8102E",
    correctPosition: { x: 0, y: 2 },
    facts: "موطن حضارة ما بين النهرين",
    category: "الشرق الأوسط",
  },
  {
    id: "syria",
    name: "سوريا",
    flag: "🇸🇾",
    color: "#C8102E",
    correctPosition: { x: 1, y: 2 },
    facts: "تضم مدينة دمشق العريقة",
    category: "الشرق الأوسط",
  },
  {
    id: "yemen",
    name: "اليمن",
    flag: "🇾🇪",
    color: "#C8102E",
    correctPosition: { x: 2, y: 2 },
    facts: "تعتبر من أقدم المراكز الحضارية",
    category: "الشرق الأوسط",
  },
  {
    id: "oman",
    name: "عمان",
    flag: "🇴🇲",
    color: "#C8102E",
    correctPosition: { x: 0, y: 3 },
    facts: "عاصمتها مسقط",
    category: "الشرق الأوسط",
  },
  {
    id: "kuwait",
    name: "الكويت",
    flag: "🇰🇼",
    color: "#C8102E",
    correctPosition: { x: 1, y: 3 },
    facts: "عاصمتها مدينة الكويت",
    category: "الشرق الأوسط",
  },
  {
    id: "bahrain",
    name: "البحرين",
    flag: "🇧🇭",
    color: "#C8102E",
    correctPosition: { x: 2, y: 3 },
    facts: "أرخبيل مكون من 33 جزيرة",
    category: "الشرق الأوسط",
  },

  // Additional category: الخليج العربي
  {
    id: "saudi_arabia_gulf",
    name: "السعودية",
    flag: "🇸🇦",
    color: "#006233",
    correctPosition: { x: 0, y: 0 },
    facts: "موطن الحرمين الشريفين",
    category: "الخليج العربي",
  },
  {
    id: "uae_gulf",
    name: "الإمارات",
    flag: "🇦🇪",
    color: "#C8102E",
    correctPosition: { x: 1, y: 0 },
    facts: "عاصمتها أبوظبي",
    category: "الخليج العربي",
  },
  {
    id: "qatar_gulf",
    name: "قطر",
    flag: "🇶🇦",
    color: "#8A1538",
    correctPosition: { x: 2, y: 0 },
    facts: "استضافت كأس العالم 2022",
    category: "الخليج العربي",
  },
  {
    id: "oman_gulf",
    name: "عمان",
    flag: "🇴🇲",
    color: "#C8102E",
    correctPosition: { x: 0, y: 1 },
    facts: "عاصمتها مسقط",
    category: "الخليج العربي",
  },
  {
    id: "kuwait_gulf",
    name: "الكويت",
    flag: "🇰🇼",
    color: "#C8102E",
    correctPosition: { x: 1, y: 1 },
    facts: "عاصمتها مدينة الكويت",
    category: "الخليج العربي",
  },
  {
    id: "bahrain_gulf",
    name: "البحرين",
    flag: "🇧🇭",
    color: "#C8102E",
    correctPosition: { x: 2, y: 1 },
    facts: "أرخبيل مكون من 33 جزيرة",
    category: "الخليج العربي",
  },

  // Additional category: شمال أفريقيا الكبرى
  {
    id: "morocco_maghreb",
    name: "المغرب",
    flag: "🇲🇦",
    color: "#C91432",
    correctPosition: { x: 0, y: 0 },
    facts: "عاصمتها الرباط",
    category: "شمال أفريقيا الكبرى",
  },
  {
    id: "algeria_maghreb",
    name: "الجزائر",
    flag: "🇩🇿",
    color: "#006233",
    correctPosition: { x: 1, y: 0 },
    facts: "أكبر دولة في أفريقيا",
    category: "شمال أفريقيا الكبرى",
  },
  {
    id: "tunisia_maghreb",
    name: "تونس",
    flag: "🇹🇳",
    color: "#E70013",
    correctPosition: { x: 2, y: 0 },
    facts: "عاصمتها تونس",
    category: "شمال أفريقيا الكبرى",
  },
  {
    id: "libya_maghreb",
    name: "ليبيا",
    flag: "🇱🇾",
    color: "#239E46",
    correctPosition: { x: 3, y: 0 },
    facts: "لديها ساحل على البحر المتوسط",
    category: "شمال أفريقيا الكبرى",
  },
  {
    id: "mauritania_maghreb",
    name: "موريتانيا",
    flag: "🇲🇷",
    color: "#006233",
    correctPosition: { x: 0, y: 1 },
    facts: "عاصمتها نواكشوط",
    category: "شمال أفريقيا الكبرى",
  },
  {
    id: "egypt_maghreb",
    name: "مصر",
    flag: "🇪🇬",
    color: "#C8102E",
    correctPosition: { x: 1, y: 1 },
    facts: "أكبر دولة عربية من حيث السكان",
    category: "شمال أفريقيا الكبرى",
  },
  {
    id: "sudan_maghreb",
    name: "السودان",
    flag: "🇸🇩",
    color: "#D21034",
    correctPosition: { x: 2, y: 1 },
    facts: "أكبر دولة في أفريقيا من حيث المساحة",
    category: "شمال أفريقيا الكبرى",
  },
];

// Function to generate GridLayout based on puzzle array
export const generateGridLayout = (puzzleArray, gridColumns = 3) => {
  // Find the maximum x and y coordinates to determine grid size
  const maxX = Math.max(...puzzleArray.map((p) => p.correctPosition.x));
  const maxY = Math.max(...puzzleArray.map((p) => p.correctPosition.y));

  // Use max coordinates to determine grid size, but at least 3 columns
  const calculatedCols = Math.max(gridColumns, maxX + 1);
  const calculatedRows = maxY + 1;

  const grid = [];

  // Create grid with empty cells
  for (let row = 0; row < calculatedRows; row++) {
    for (let col = 0; col < calculatedCols; col++) {
      const position = row * calculatedCols + col;
      grid.push({
        position,
        x: col,
        y: row,
        countryId: null,
        label: "",
      });
    }
  }

  // Place countries in their correct positions
  puzzleArray.forEach((country) => {
    const { correctPosition, id, name } = country;
    const position = correctPosition.y * calculatedCols + correctPosition.x;

    if (position < grid.length) {
      grid[position] = {
        ...grid[position],
        countryId: id,
        label: name,
      };
    }
  });

  return grid;
};

// Pre-computed grid layouts for each category
export const GridLayouts = {
  "شمال أفريقيا": generateGridLayout(
    PuzzleArray.filter((c) => c.category === "شمال أفريقيا"),
    3
  ),
  "الشرق الأوسط": generateGridLayout(
    PuzzleArray.filter((c) => c.category === "الشرق الأوسط"),
    3
  ),
  "الخليج العربي": generateGridLayout(
    PuzzleArray.filter((c) => c.category === "الخليج العربي"),
    3
  ),
  "شمال أفريقيا الكبرى": generateGridLayout(
    PuzzleArray.filter((c) => c.category === "شمال أفريقيا الكبرى"),
    4
  ),
};

// Default GridLayout for backward compatibility
export const GridLayout = GridLayouts["شمال أفريقيا"];

// Helper functions
export const getCategories = () => {
  const categories = [
    ...new Set(PuzzleArray.map((country) => country.category)),
  ];
  return categories;
};

export const getCountriesByCategory = (category) => {
  return PuzzleArray.filter((country) => country.category === category);
};

export const getGridForCategory = (category) => {
  return (
    GridLayouts[category] ||
    generateGridLayout(getCountriesByCategory(category))
  );
};
