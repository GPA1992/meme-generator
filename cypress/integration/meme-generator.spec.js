import 'cypress-file-upload';

const evaluateOffset = (doc, selector, offsetType) => {
  return doc.querySelector(selector).getBoundingClientRect()[`${offsetType}`];
};

const isOnSameHorizontal = (firstElement, secondElement) =>
  (firstElement.top >= secondElement.top &&
    firstElement.bottom <= secondElement.bottom) ||
  (secondElement.top >= firstElement.top && secondElement.bottom <= firstElement.bottom);

const isOnSameVertical = (firstElement, secondElement) =>
  (firstElement.left >= secondElement.left &&
    firstElement.right <= secondElement.right) ||
  (secondElement.left >= firstElement.left && secondElement.right <= firstElement.right);

const isOverEachother = (backgroundElement, forefrontElement) => {
  backgroundElement.bottom = backgroundElement.top + backgroundElement.height;
  backgroundElement.right = backgroundElement.left + backgroundElement.width;

  forefrontElement.bottom = forefrontElement.top + forefrontElement.height;
  forefrontElement.right = forefrontElement.left + forefrontElement.width;

  return (
    isOnSameHorizontal(backgroundElement, forefrontElement) &&
    isOnSameVertical(backgroundElement, forefrontElement)
  );
};

const checkFullOverlappage = (backgroundSelector, forefrontSelector) => {
  cy.document().then(doc => {
    const backgroundElement = {
      top: evaluateOffset(doc, backgroundSelector, 'top'),
      height: evaluateOffset(doc, backgroundSelector, 'height'),
      left: evaluateOffset(doc, backgroundSelector, 'left'),
      width: evaluateOffset(doc, backgroundSelector, 'width'),
    };

    const forefrontElement = {
      top: evaluateOffset(doc, forefrontSelector, 'top'),
      height: evaluateOffset(doc, forefrontSelector, 'height'),
      left: evaluateOffset(doc, forefrontSelector, 'left'),
      width: evaluateOffset(doc, forefrontSelector, 'width'),
    };

    expect(isOverEachother(backgroundElement, forefrontElement)).to.be.true;

    expect(forefrontElement.top).to.not.be.undefined;
    expect(forefrontElement.bottom).to.not.be.undefined;
    expect(forefrontElement.left).to.not.be.undefined;
    expect(forefrontElement.right).to.not.be.undefined;
    expect(forefrontElement.right != forefrontElement.left).to.be.true;
    expect(forefrontElement.top != forefrontElement.bottom).to.be.true;
  });
};

const typeTextAndCheckItsPosition = (container, child) => {
  typeText();
  checkTypedTextIsVisible();
  checkFullOverlappage(container, child);
};

const typeText = () => {
  cy.get('#text-input')
    .type('My awesome meme')
    .should('have.value', 'My awesome meme');
}

const checkTypedTextIsVisible = () => {
  cy.contains(/^My awesome meme$/).should('be.visible');
}

const memeUpload = () => {
  const fileName = 'meme.jpeg';
  cy.fixture(fileName).then(fileContent => {
    cy.get('#meme-insert').upload({
      fileContent,
      fileName,
      mimeType: 'image/jpeg',
    });
  });
};

//-------

describe("1 - Crie uma caixa de texto com a qual quem usa pode interagir para inserir texto em cima da imagem escolhida.", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('/');
  })

  it("Ser?? validado se o input de texto existe e conseguimos inputar texto nele", () => {
    typeText();
  })

  it("Ser?? validado se o texto digitado no input ?? vis??vel na tela", () => {
    typeText();
    checkTypedTextIsVisible();
  })

  it("Ser?? validado se existe um elemento de container para onde o texto ser?? mostrado", () => {
    typeText();
    checkTypedTextIsVisible();
    checkFullOverlappage('#meme-image-container', '#meme-text');
  })
});

describe("2 - O site deve permitir que quem usa fa??a upload de uma imagem de seu computador.", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('/');
  })

  it("Ser?? validado se ?? poss??vel carregar uma imagem atrav??s do elemento correto", () => {
    memeUpload();
  })

  it("Ser?? validado se a imagem carregada ?? exibida dentro do elemento correto", () => {
    memeUpload();
    cy.get('#meme-image').should('be.visible');
  })

  it("Ser?? validado se o texto ?? inserido corretamente sobre a imagem", () => {
    memeUpload();
    cy.get('#meme-image').should('be.visible');
    typeTextAndCheckItsPosition('#meme-image', '#meme-text');
  })
});

describe("3 - Adicione uma moldura no container. A moldura deve ter 1 pixel de largura, deve ser preta e do tipo 'solid'. A ??rea onde a imagem aparecer?? deve ter fundo branco.", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('/');
    cy.reload();
  })

  it("Ser?? validado se o elemento que serve de container para a imagem tem a cor de fundo branca", () => {
    cy.get('#meme-image-container').should($container => {
      expect($container).to.have.css('background-color', 'rgb(255, 255, 255)');
    });
  })

  it("Ser?? validado se o elemento que serve de container para a imagem tem uma borda preta, s??lida, com 1 pixel de largura", () => {
    cy.get('#meme-image-container').should(
      'have.css',
      'border',
      '1px solid rgb(0, 0, 0)',
    );
  })

  it("Ser?? validado se a imagem deve estar totalmente contida dentro do elemento identificado como `meme-image-container`", () => {
    memeUpload();
    checkFullOverlappage('#meme-image-container', '#meme-image');
  })
});

describe("4 - Adicione o texto que ser?? inserido sobre a imagem tem uma cor, sombra e tamanho espec??ficos.", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('/');
    cy.reload();
  })

  it("Ser?? validado se o texto do elemento `meme-text` dtem uma sombra preta, de 5 pixels na horizontal, 5 pixels na vertical e um raio de desfoque de 5 pixels", () => {
    cy.get('#meme-text').should($text => {
      expect($text).to.have.css('text-shadow', 'rgb(0, 0, 0) 5px 5px 5px');
    });
  })

  it("Ser?? validado se o texto do elemento `meme-text` tem a fonte com o tamanho de 30 pixels", () => {
    cy.get('#meme-text').should('have.css','font-size','30px',
    );
  })

  it("Ser?? validado se o texto do elemento `meme-text` deve estar na cor branca", () => {
    cy.get('#meme-text').should(
      'have.css',
      'color',
      'rgb(255, 255, 255)',
    );
  })
});

describe("5 - Limite o tamanho do texto que o usu??rio pode inserir.", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('/');
    cy.reload();
  })

  it("Ser?? validado se a quantidade m??xima de caracteres digit??veis no elemento `text-input` deve ser 60.", () => {
    cy.get('#text-input')
      .type('I have written a line that has precisely sixty-one characters')
      .should(
        'have.value',
        'I have written a line that has precisely sixty-one character',
      );
  })
});

// Bonus requirements

describe("6 - Permita a quem usa customizar o meme escolhido acrescentando a ele uma de tr??s bordas. A p??gina deve ter tr??s bot??es, que ao serem clicados devem cada um trocar a pr??pria borda ao redor do container.", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('/');
  })

  it("Ser?? validado se o bot??o com identificado com id `fire` funciona corretamente.", () => {
    cy.get('#fire').should(
      'have.css',
      'background-color',
      'rgb(255, 0, 0)',
    );
    cy.get('#fire').click();
    cy.get('#meme-image-container').should(
      'have.css',
      'border',
      '3px dashed rgb(255, 0, 0)',
    );
  })

  it("Ser?? validado se o bot??o com identificado com id `water` funciona corretamente.", () => {
    cy.get('#water').should(
      'have.css',
      'background-color',
      'rgb(0, 0, 255)',
    );
    cy.get('#water').click();
    cy.get('#meme-image-container').should(
      'have.css',
      'border',
      '5px double rgb(0, 0, 255)',
    );
  })

  it("Ser?? validado se o bot??o com identificado com id `earth` funciona corretamente.", () => {
    cy.get('#earth').should(
      'have.css',
      'background-color',
      'rgb(0, 128, 0)',
    );
    cy.get('#earth').click();
    cy.get('#meme-image-container').should(
      'have.css',
      'border',
      '6px groove rgb(0, 128, 0)',
    );
  })
});

describe.only("7 - Tenha um conjunto de quatro imagens pr?? prontas de memes famosos para o usu??rio escolher. Mostre miniaturas das imagens e, mediante clique do usu??rio, essa imagem deve aparecer dentro da moldura do elemento de container.", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit('/');
  })

  it("Ser?? validado se as imagens prontas apresentam o comportamente esperado.", () => {
    [1, 2, 3, 4].map(memeId => {
      cy.get(`#meme-${memeId}`).click();
      cy.get('#meme-image')
        .should('have.attr', 'src')
        .and('match', new RegExp(`imgs/meme${memeId}.png$`));
    });
  })
});
