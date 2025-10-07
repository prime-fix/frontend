import { Component, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-state-notification',
  imports: [TranslateModule],
  templateUrl: './state-notification.html',
  styleUrl: './state-notification.css'
})
export class StateNotification {
  close = output<void>();

  onAccept() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
