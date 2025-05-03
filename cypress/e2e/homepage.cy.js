describe('Kino-projekt – Startsida', () => {
  it('Sidan laddas och visar rätt rubrik', () => {
    cy.visit('/start.html');
    cy.get('h1.page-title')
      .should('contain.text', 'Vad vill du se?');
  });
});
