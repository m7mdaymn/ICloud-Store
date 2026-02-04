import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar -->
      <app-sidebar 
        [isCollapsed]="sidebarCollapsed()" 
        (toggleCollapse)="toggleSidebar()"
      />
      
      <!-- Main Content -->
      <div 
        class="transition-all duration-300"
        [class.mr-64]="!sidebarCollapsed()"
        [class.mr-20]="sidebarCollapsed()"
      >
        <!-- Header -->
        <app-header 
          [sidebarCollapsed]="sidebarCollapsed()"
          (toggleSidebar)="toggleSidebar()"
        />
        
        <!-- Page Content -->
        <main class="p-6 mt-16">
          <router-outlet></router-outlet>
        </main>
      </div>
      
      <!-- Mobile Overlay -->
      @if (mobileMenuOpen()) {
        <div 
          class="fixed inset-0 bg-black/50 z-40 lg:hidden"
          (click)="closeMobileMenu()"
        ></div>
      }
    </div>
  `
})
export class AdminLayoutComponent {
  sidebarCollapsed = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
