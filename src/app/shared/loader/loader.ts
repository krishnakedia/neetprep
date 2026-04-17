import { Component } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
  constructor(public loaderService: LoaderService) {}
}
