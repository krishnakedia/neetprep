import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() icon?: string;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() block = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  getButtonClasses(): string {
    const classes = ['btn', `btn-${this.variant}`];
    
    if (this.size !== 'md') {
      classes.push(`btn-${this.size}`);
    }
    
    if (this.block) {
      classes.push('btn-block');
    }
    
    return classes.join(' ');
  }
}
