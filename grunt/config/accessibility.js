module.exports = {
  options: {
    accessibilityLevel: 'WCAG2A',
    reportLevels: {
      notice: false,
      warning: false,
      error: true
    }
  },
  test: {
    src: ['dist/**/*.html']
  }
}
