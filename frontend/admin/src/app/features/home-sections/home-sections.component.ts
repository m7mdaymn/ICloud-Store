import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { HomeSectionService, HomeSection, HomeSectionType } from '../../core/services/home-section.service';

@Component({
  selector: 'app-home-sections',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">أقسام الصفحة الرئيسية</h1>
          <p class="text-gray-600 dark:text-gray-400">إدارة محتوى الصفحة الرئيسية</p>
        </div>
        <a routerLink="/home-sections/create" class="btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          إضافة قسم
        </a>
      </div>
      
      @if (isLoading()) {
        <div class="admin-card flex items-center justify-center py-12">
          <svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      } @else {
        <div class="space-y-4">
          @for (section of sections(); track section.id) {
            <div class="admin-card flex items-center gap-4">
              <div class="w-10 text-center">
                <span class="text-2xl font-bold text-gray-300">{{ section.sortOrder }}</span>
              </div>
              @if (section.imageUrl) {
                <img [src]="section.imageUrl" class="w-20 h-14 object-cover rounded-lg"/>
              } @else {
                <div class="w-20 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"/>
                  </svg>
                </div>
              }
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 dark:text-white">{{ section.titleAr }}</h3>
                <p class="text-sm text-gray-500">{{ getSectionTypeLabel(section.sectionType) }}</p>
              </div>
              <div class="flex items-center gap-2">
                @if (section.isActive) {
                  <span class="badge badge-success">نشط</span>
                } @else {
                  <span class="badge badge-danger">غير نشط</span>
                }
              </div>
              <div class="flex items-center gap-2">
                <a [routerLink]="['/home-sections/edit', section.id]" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </a>
                <button (click)="deleteSection(section)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          } @empty {
            <div class="admin-card text-center py-12 text-gray-500">لا توجد أقسام</div>
          }
        </div>
      }
      
      @if (showDeleteModal()) {
        <div class="modal-backdrop" (click)="showDeleteModal.set(false)">
          <div class="modal-content p-6 text-center" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-semibold mb-4">حذف القسم</h3>
            <p class="text-gray-600 mb-6">هل أنت متأكد؟</p>
            <div class="flex justify-center gap-3">
              <button (click)="showDeleteModal.set(false)" class="btn-secondary">إلغاء</button>
              <button (click)="confirmDelete()" class="btn-danger">حذف</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class HomeSectionsComponent implements OnInit {
  sections = signal<HomeSection[]>([]);
  isLoading = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);
  sectionToDelete = signal<HomeSection | null>(null);

  constructor(private homeSectionService: HomeSectionService) {}

  ngOnInit(): void { this.loadSections(); }

  loadSections(): void {
    this.isLoading.set(true);
    this.homeSectionService.getAll(true).subscribe({
      next: (r) => { if (r.success) this.sections.set(r.data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  getSectionTypeLabel(type: HomeSectionType): string {
    const labels: Record<number, string> = {
      0: 'بانر', 1: 'وحدات مميزة', 2: 'عرض الأقسام', 3: 'عرض العلامات', 4: 'وصل حديثاً', 5: 'إكسسوارات', 6: 'مخصص'
    };
    return labels[type] || '';
  }

  deleteSection(section: HomeSection): void {
    this.sectionToDelete.set(section);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const section = this.sectionToDelete();
    if (!section) return;
    this.homeSectionService.delete(section.id).subscribe({
      next: () => { this.loadSections(); this.showDeleteModal.set(false); }
    });
  }
}
