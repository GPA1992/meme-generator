const inputText = document.querySelector('#text-input');
const memeText = document.querySelector('#meme-text');
const imgMeme = document.querySelector('#meme-image');
const memeInput = document.querySelector('#meme-insert');
const fireButoon = document.querySelector('#fire');
const waterButton = document.querySelector('#water');
const earthButton = document.querySelector('#earth');
const memeImgContainer = document.getElementById('meme-image-container');
const meme1 = document.querySelector('#meme-1');
const meme2 = document.querySelector('#meme-2');
const meme3 = document.querySelector('#meme-3');
const meme4 = document.querySelector('#meme-4');

inputText.addEventListener('keyup', () => {
  memeText.innerHTML = inputText.value;
});

memeInput.addEventListener('change', (e) => {
  const reader = new FileReader();
  console.log(reader);
  reader.onload = () => {
    imgMeme.src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
  memeText.innerHTML = inputText.value;
});

fireButoon.addEventListener('click', () => {
  memeImgContainer.removeAttribute('border');
  memeImgContainer.style.border = '3px solid rgb(255, 0, 0)';
  memeImgContainer.style.borderStyle = 'dashed';
});

waterButton.addEventListener('click', () => {
  memeImgContainer.removeAttribute('border');
  memeImgContainer.style.border = '5px solid rgb(0, 0, 255)';
  memeImgContainer.style.borderStyle = 'double';
});

earthButton.addEventListener('click', () => {
  memeImgContainer.removeAttribute('border');
  memeImgContainer.style.border = '6px solid rgb(0, 128, 0)';
  memeImgContainer.style.borderStyle = 'groove';
});

meme1.addEventListener('click', () => {
  imgMeme.src = './imgs/meme1.png';
  memeText.innerHTML = inputText.value;
});

meme2.addEventListener('click', () => {
  imgMeme.src = './imgs/meme2.png';
  memeText.innerHTML = inputText.value;
});

meme3.addEventListener('click', () => {
  imgMeme.src = './imgs/meme3.png';
  memeText.innerHTML = inputText.value;
});

meme4.addEventListener('click', () => {
  imgMeme.src = './imgs/meme4.png';
  memeText.innerHTML = inputText.value;
});
