import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Modernize Angular Admin Tempplate';

  constructor(private router: Router, private titleService: Title) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.router.routerState.snapshot.root;
      this.setTitle(currentRoute);
    });
  }

  setTitle(route: any) {
    while (route.firstChild) {
      route = route.firstChild;
    }
    if (route.data && route.data.title) {
      this.titleService.setTitle(`Formularios DGA - ${route.data.title}`);
    } else {
      this.titleService.setTitle('Formularios DGA');
    }
  }


}
