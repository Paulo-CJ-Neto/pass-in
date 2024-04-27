export default function criarSlug(stringOriginal: string): string {
    // Remove acentos da string
    const stringSemAcentos = stringOriginal.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Substitui espaços por hífens e converte para minúsculas
    const slug = stringSemAcentos
        .toLowerCase()
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/[^\w-]+/g, ''); // Remove caracteres não alfanuméricos exceto hífens

    return slug;
}
