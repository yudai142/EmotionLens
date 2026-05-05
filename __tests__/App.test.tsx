import { render, screen } from '@testing-library/react'
import App from '../src/App'
import '@testing-library/jest-dom'

describe('App コンポーネント', () => {
  it('EmotionLens のタイトルが表示されること', () => {
    render(<App />)
    expect(screen.getByText('EmotionLens')).toBeInTheDocument()
  })

  it('セットアップメッセージが表示されること', () => {
    render(<App />)
    expect(screen.getByText('セットアップ中...')).toBeInTheDocument()
  })

  it('ビデオ会議中の感情をリアルタイム解析テキストが表示されること', () => {
    render(<App />)
    expect(screen.getByText('ビデオ会議中の感情をリアルタイム解析')).toBeInTheDocument()
  })
})
