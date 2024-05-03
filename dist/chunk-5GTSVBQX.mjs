// src/utils/slug_generate.ts
function criarSlug(stringOriginal) {
  const stringSemAcentos = stringOriginal.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const slug = stringSemAcentos.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  return slug;
}

export {
  criarSlug
};
