import * as htmlToImage from 'html-to-image';

export const saveCardAsImage = async (nodeRef: any, dateString: string) => {
  try {
    const dataUrl = await htmlToImage.toPng(nodeRef.current, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    link.download = `аппроксимация-${dateString}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Ошибка при сохранении карточки:', error);
  }
};
