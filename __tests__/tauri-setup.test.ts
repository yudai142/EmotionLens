import { describe, it, expect, beforeAll } from '@jest/globals'
import * as fs from 'fs'
import * as path from 'path'

describe('Tauri初期セットアップのテスト', () => {
  describe('プロジェクト構造', () => {
    it('src ディレクトリが存在すること', () => {
      const srcPath = path.join(process.cwd(), 'src')
      expect(fs.existsSync(srcPath)).toBe(true)
    })

    it('src-tauri ディレクトリが存在すること', () => {
      const tauriPath = path.join(process.cwd(), 'src-tauri')
      expect(fs.existsSync(tauriPath)).toBe(true)
    })

    it('src-tauri/src ディレクトリが存在すること', () => {
      const tauriSrcPath = path.join(process.cwd(), 'src-tauri', 'src')
      expect(fs.existsSync(tauriSrcPath)).toBe(true)
    })
  })

  describe('設定ファイル', () => {
    it('vite.config.ts が存在すること', () => {
      const configPath = path.join(process.cwd(), 'vite.config.ts')
      expect(fs.existsSync(configPath)).toBe(true)
    })

    it('tauri.conf.json が存在すること', () => {
      const configPath = path.join(process.cwd(), 'src-tauri', 'tauri.conf.json')
      expect(fs.existsSync(configPath)).toBe(true)
    })

    it('Cargo.toml が存在すること', () => {
      const configPath = path.join(process.cwd(), 'src-tauri', 'Cargo.toml')
      expect(fs.existsSync(configPath)).toBe(true)
    })

    it('tsconfig.json が存在すること', () => {
      const configPath = path.join(process.cwd(), 'tsconfig.json')
      expect(fs.existsSync(configPath)).toBe(true)
    })
  })

  describe('フロントエンドファイル', () => {
    it('index.html が存在すること', () => {
      const indexPath = path.join(process.cwd(), 'index.html')
      expect(fs.existsSync(indexPath)).toBe(true)
    })

    it('src/main.tsx が存在すること', () => {
      const mainPath = path.join(process.cwd(), 'src', 'main.tsx')
      expect(fs.existsSync(mainPath)).toBe(true)
    })

    it('src/App.tsx が存在すること', () => {
      const appPath = path.join(process.cwd(), 'src', 'App.tsx')
      expect(fs.existsSync(appPath)).toBe(true)
    })

    it('src/index.css が存在すること', () => {
      const cssPath = path.join(process.cwd(), 'src', 'index.css')
      expect(fs.existsSync(cssPath)).toBe(true)
    })

    it('src/App.css が存在すること', () => {
      const cssPath = path.join(process.cwd(), 'src', 'App.css')
      expect(fs.existsSync(cssPath)).toBe(true)
    })
  })

  describe('Rustエントリポイント', () => {
    it('src-tauri/src/main.rs が存在すること', () => {
      const mainRsPath = path.join(process.cwd(), 'src-tauri', 'src', 'main.rs')
      expect(fs.existsSync(mainRsPath)).toBe(true)
    })

    it('src-tauri/build.rs が存在すること', () => {
      const buildRsPath = path.join(process.cwd(), 'src-tauri', 'build.rs')
      expect(fs.existsSync(buildRsPath)).toBe(true)
    })
  })

  describe('package.json の依存関係', () => {
    let packageJson: any

    beforeAll(() => {
      const packagePath = path.join(process.cwd(), 'package.json')
      const content = fs.readFileSync(packagePath, 'utf-8')
      packageJson = JSON.parse(content)
    })

    it('Tauri APIがdevDependenciesに含まれること', () => {
      expect(packageJson.devDependencies['@tauri-apps/api']).toBeDefined()
    })

    it('Tauri CLIがdevDependenciesに含まれること', () => {
      expect(packageJson.devDependencies['@tauri-apps/cli']).toBeDefined()
    })

    it('ViteがdevDependenciesに含まれること', () => {
      expect(packageJson.devDependencies.vite).toBeDefined()
    })

    it('@vitejs/plugin-reactがdevDependenciesに含まれること', () => {
      expect(packageJson.devDependencies['@vitejs/plugin-react']).toBeDefined()
    })

    it('Next.jsがdependenciesから削除されていること', () => {
      expect(packageJson.dependencies.next).toBeUndefined()
    })

    it('next-authがdependenciesから削除されていること', () => {
      expect(packageJson.dependencies['next-auth']).toBeUndefined()
    })

    it('Reactが含まれていること', () => {
      expect(packageJson.dependencies.react).toBeDefined()
    })

    it('React Domが含まれていること', () => {
      expect(packageJson.dependencies['react-dom']).toBeDefined()
    })
  })

  describe('tauri.conf.json の設定', () => {
    let tauriConf: any

    beforeAll(() => {
      const configPath = path.join(process.cwd(), 'src-tauri', 'tauri.conf.json')
      const content = fs.readFileSync(configPath, 'utf-8')
      tauriConf = JSON.parse(content)
    })

    it('アプリ名が正しく設定されていること', () => {
      expect(tauriConf.package.productName).toBe('EmotionLens')
    })

    it('ウィンドウタイトルが正しく設定されていること', () => {
      expect(tauriConf.app.windows[0].title).toBe('EmotionLens')
    })

    it('ViteのdevUrlが設定されていること', () => {
      expect(tauriConf.build.devUrl).toBeDefined()
    })

    it('frontendDistが設定されていること', () => {
      expect(tauriConf.build.frontendDist).toBeDefined()
    })
  })

  describe('Cargo.toml の設定', () => {
    let cargoContent: string

    beforeAll(() => {
      const cargoPath = path.join(process.cwd(), 'src-tauri', 'Cargo.toml')
      cargoContent = fs.readFileSync(cargoPath, 'utf-8')
    })

    it('パッケージ名が正しく設定されていること', () => {
      expect(cargoContent).toContain('name = "emotion-lens"')
    })

    it('tauriが依存関係に含まれていること', () => {
      expect(cargoContent).toContain('tauri')
    })

    it('serdeが依存関係に含まれていること', () => {
      expect(cargoContent).toContain('serde')
    })

    it('tokioが依存関係に含まれていること', () => {
      expect(cargoContent).toContain('tokio')
    })
  })
})
