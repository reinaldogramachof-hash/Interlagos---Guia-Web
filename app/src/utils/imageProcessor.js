/**
 * Processador de imagens usando Canvas API nativa.
 * Redimensiona mantendo aspect ratio e converte para JPEG comprimido.
 */
export async function processImage(file, maxSize = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    // Carregar o arquivo em um elemento de imagem
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Limpeza imediata da URL após carregar na memória da imagem
      URL.revokeObjectURL(objectUrl);

      // Calcular o fator de redimensionamento (mantendo aspect ratio)
      const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
      
      // Mesmo se ratio for 1, continuamos para garantir a conversão para JPEG
      // e aplicação da compressão/qualidade desejada.
      
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);

      // Criar canvas para processamento
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Falha ao criar contexto 2D do Canvas'));
      }

      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, w, h);

      // Exportar como JPEG com a qualidade informada
      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error('Falha ao converter canvas para Blob'));
        }

        // Criar novo objeto File baseado no nome original (com extensão .jpg)
        const fileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
        const newFile = new File([blob], fileName, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        });

        resolve(newFile);
      }, 'image/jpeg', quality);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}
