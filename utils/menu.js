Object.values(commands).forEach(c => {
  const cat = c.category || "Other";  
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(c.name);
});