import { Component, input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-widget-generic',
    imports: [],
    template: `
        <div class="card mb-0 w-full max-h-[126px]">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">{{ title() }}</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-lg  xl:text-xl">{{ middle() }}</div>
                </div>
                <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i [class]="icon()"></i>
                </div>
            </div>
            <!-- <span class="text-primary font-medium">{{ bottomCount() }} </span>
            <span class="text-muted-color">{{ bottomText() }}</span> -->
        </div>
    `
})
export class WidgetGenericComponent {
    title = input.required<string>();
    middle = input.required<string>();
    // bottomCount = input.required<string>();
    // bottomText = input.required<string>();
    icon = input.required<string>();
}
