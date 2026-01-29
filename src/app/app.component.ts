import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PROJECTS } from './project-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  form: FormGroup;
  projects = PROJECTS;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      projectId: ['', Validators.required],
      version: ['', Validators.required]
    });
  }

  downloadDoc() {

    if (this.form.invalid) {
      alert('Please select project and version');
      return;
    }

    const { projectId, version } = this.form.value;

    const selectedProject = this.projects.find(p => p.id === projectId);

    if (!selectedProject) {
      alert('Invalid project');
      return;
    }

    this.http.get(selectedProject.templatePath, { responseType: 'text' })
      .subscribe(template => {

        const updatedDoc = template.replace(/{{VERSION}}/g, version);

        const blob = new Blob(['\ufeff', updatedDoc], {
          type: 'application/msword'
        });

        const fileName = `${projectId}_${version}.doc`;

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);

      });
  }
}
