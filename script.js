const inputText = document.querySelector('#text-input');
const memeText = document.querySelector('#meme-text');
const imgMeme = document.querySelector('#meme-image');
const memeInput = document.querySelector('#meme-insert');

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
  document.querySelector('#meme-text').innerHTML = inputText.value;
});
