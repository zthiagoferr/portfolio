import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

/**
 * Angular shell for the approved portfolio markup. The existing interaction
 * engine is loaded AFTER Angular creates the view to keep the same behaviour.
 * A later refactor may migrate individual effects into Angular services.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private legacyScript?: HTMLScriptElement;
  private extrasScript?: HTMLScriptElement;
  private signatureScript?: HTMLScriptElement;
  private uniqueScript?: HTMLScriptElement;
  private proScript?: HTMLScriptElement;
  private smartScript?: HTMLScriptElement;
  private cinematicScript?: HTMLScriptElement;
  private premiumScript?: HTMLScriptElement;
  private flipScript?: HTMLScriptElement;

  ngAfterViewInit(): void {
    this.legacyScript = this.document.createElement('script');
    this.legacyScript.src = 'assets/js/main.js';
    this.legacyScript.defer = true;
    this.legacyScript.dataset['portfolioInteractions'] = 'true';
    this.legacyScript.async = false;
    this.document.body.appendChild(this.legacyScript);
    this.extrasScript = this.document.createElement('script');
    this.extrasScript.src = 'assets/js/extra-animations.js';
    this.extrasScript.async = false;
    this.document.body.appendChild(this.extrasScript);
    this.signatureScript = this.document.createElement('script');
    this.signatureScript.src = 'assets/js/signature-experience.js';
    this.signatureScript.async = false;
    this.document.body.appendChild(this.signatureScript);
    this.uniqueScript = this.document.createElement('script');
    this.uniqueScript.src = 'assets/js/unique-experience.js';
    this.uniqueScript.async = false;
    this.document.body.appendChild(this.uniqueScript);
    this.proScript = this.document.createElement("script");
    this.proScript.src = "assets/js/pro-interactions.js";
    this.proScript.async = false;
    this.document.body.appendChild(this.proScript);
    this.smartScript = this.document.createElement("script");
    this.smartScript.src = "assets/js/smart-features.js";
    this.smartScript.async = false;
    this.document.body.appendChild(this.smartScript);
    this.cinematicScript = this.document.createElement("script");
    this.cinematicScript.src = "assets/js/cinematic-effects.js";
    this.cinematicScript.async = false;
    this.document.body.appendChild(this.cinematicScript);
    this.premiumScript = this.document.createElement("script");
    this.premiumScript.src = "assets/js/cinematic-premium.js";
    this.premiumScript.async = false;
    this.document.body.appendChild(this.premiumScript);
    this.flipScript = this.document.createElement("script");
    this.flipScript.src = "assets/js/python-flip-card.js";
    this.flipScript.async = false;
    this.document.body.appendChild(this.flipScript);
  }

  ngOnDestroy(): void {
    this.legacyScript?.remove();
    this.extrasScript?.remove();
    this.signatureScript?.remove();
    this.uniqueScript?.remove();
    this.proScript?.remove();
    this.smartScript?.remove();
    this.cinematicScript?.remove();
    this.premiumScript?.remove();
    this.flipScript?.remove();
  }
}
