import config from '../tailwind.config';

describe('tailwind.config.ts', () => {
  it('DaisyUI の emotion-dark テーマを定義している', () => {
    const daisyui = (config as { daisyui?: { themes?: Array<Record<string, unknown>> } }).daisyui;
    expect(daisyui?.themes).toBeDefined();

    const themes = daisyui?.themes ?? [];
    const hasEmotionDark = themes.some((theme) => Object.prototype.hasOwnProperty.call(theme, 'emotion-dark'));

    expect(hasEmotionDark).toBe(true);
  });

  it('emotion カラーを拡張している', () => {
    const colors = (config as { theme?: { extend?: { colors?: Record<string, string> } } }).theme?.extend?.colors;

    expect(colors?.['emotion-angry']).toBe('#FF3B3B');
    expect(colors?.['emotion-anxious']).toBe('#FBBF24');
    expect(colors?.['emotion-happy']).toBe('#22C55E');
    expect(colors?.['emotion-neutral']).toBe('#00D4FF');
    expect(colors?.['emotion-stressed']).toBe('#F97316');
    expect(colors?.['emotion-hiding']).toBe('#A855F7');
  });
});
