import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    // Renderer2 é a forma segura do Angular para manipular o DOM (mudar o HTML/CSS).
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  //  aplica a classe CSS no corpo da página
  applyTheme(theme: 'Tema Claro' | 'Tema Escuro') {
    const themeClass = theme === 'Tema Escuro' ? 'dark-theme' : 'light-theme';

    // Remove o tema antigo antes de aplicar o novo para não ter classes conflitantes
    this.renderer.removeClass(document.body, 'dark-theme');
    this.renderer.removeClass(document.body, 'light-theme');

    // Adiciona a classe correta
    this.renderer.addClass(document.body, themeClass);
  }
}
