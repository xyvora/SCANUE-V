describe('Chat Interface', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('/chat')
    cy.get('[data-testid="chat-interface"]').should('be.visible')
  })

  it('sends a message and receives a response', () => {
    cy.get('input[placeholder*="Message"]').type('Hello{enter}')
    cy.contains('Hello').should('be.visible')
    cy.contains('This is a simulated', { timeout: 10000 }).should('be.visible')
  })

  it('switches between agent types', () => {
    cy.contains('PFC').click()
    cy.get('input[placeholder*="Message PFC agent"]').should('be.visible')
    cy.contains('General').click()
    cy.get('input[placeholder*="Message General agent"]').should('be.visible')
  })

  it('handles feedback submission', () => {
    cy.get('input[placeholder*="Message"]').type('Test message{enter}')
    cy.get('button[aria-label="Positive feedback"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('input[placeholder*="Write your feedback"]').type('Great response!')
    cy.get('button[aria-label="Submit feedback"]').click()
  })
})

