import { render, screen } from '@testing-library/react'
import App from '../src/App'
import '@testing-library/jest-dom'

describe('App コンポーネント', () => {
  it('EmotionLens のタイトルが表示されること', () => {
    render(<App />)
    expect(screen.getByText('EmotionLens')).toBeInTheDocument()
  })

  it('カウンターボタンが存在すること', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })
    expect(button).toBeInTheDocument()
  })
})
