describe('Navigation', () => {
  beforeEach(() => {
    /* Clear any persisted state before each test */
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('navigates between pages', () => {
    cy.visit('/')
    cy.get('[data-testid="chat-interface"]', { timeout: 10000 }).should('be.visible')
    cy.get('nav')
      .should('be.visible')
      .and('have.css', 'position', 'fixed')
      .and('have.css', 'top', '0px')

    // Test scroll behavior
    cy.window().then(($window) => {
      // Ensure smooth scrolling
      $window.scrollTo({ top: 100, behavior: 'smooth' })
    })
    cy.get('nav')
      .should('have.class', 'transform')
      .and('have.css', 'transform')
      .and('include', 'translateY(-100%)')

    cy.window().then(($window) => {
      $window.scrollTo({ top: 0, behavior: 'smooth' })
    })
    cy.get('nav').should('not.have.class', 'transform')

    cy.contains('SCANUEV Chat').should('be.visible')

    cy.get('a[href="/about"]').click()
    cy.url().should('include', '/about')
    // Add more specific content checks
    cy.contains('About SCANUEV').should('be.visible')
    cy.contains('Key Features:').should('be.visible')

    cy.get('a[href="/"]').click()
    // Ensure we're back on the home page
    cy.url().should('not.include', '/about')
    cy.contains('SCANUEV Chat').should('be.visible')
  })

  it('displays 404 page for non-existent routes', () => {
    cy.visit('/non-existent-page', { failOnStatusCode: false })
    cy.get('[data-testid="404-page"]').should('be.visible')
  })
})
