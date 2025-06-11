import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./sidebar.component.css'], // הוסף כאן את קובץ ה-CSS
  template: `
    <aside class="fixed inset-y-0 right-0 w-64 bg-white shadow-lg border-l border-gray-200 z-40 transform transition-transform duration-300 ease-in-out">
      <div class="flex flex-col h-full">
        <div class="flex-1 flex flex-col pt-20 pb-4 overflow-y-auto">
          <nav class="mt-5 flex-1 px-4 space-y-2">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="active"
              class="sidebar-nav-item group"
            >
              <svg class="ml-3 small-icon text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
              </svg>
              לוח בקרה
            </a>

            <a 
              routerLink="/receipts" 
              routerLinkActive="active"
              class="sidebar-nav-item group"
            >
              <svg class="ml-3 small-icon text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              קבלות
            </a>

            <a 
              routerLink="/expenses" 
              routerLinkActive="active"
              class="sidebar-nav-item group"
            >
              <svg class="ml-3 small-icon text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              הוצאות
            </a>

            <a 
              routerLink="/customers" 
              routerLinkActive="active"
              class="sidebar-nav-item group"
            >
              <svg class="ml-3 small-icon text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              לקוחות
            </a>

            <a 
              routerLink="/reports" 
              routerLinkActive="active"
              class="sidebar-nav-item group"
            >
              <svg class="ml-3 small-icon text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              דוחות
            </a>
          </nav>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  constructor(private router: Router) {}
}
