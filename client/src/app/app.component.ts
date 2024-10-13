import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  serviceUrl = 'api';
  posts: any = [];
  searchTitle = "";
  showAddDialog = false;
  addPostForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required])
  })
  constructor(private http: HttpClient) {
  }

  ngAfterViewInit(): void {
    this.allPosts();
  }

  allPosts() {
    this.http.get(`${this.serviceUrl}/posts`).subscribe((data :any)=> {
      this.posts = data.hits.hits;
    })
  }

  searchPosts() {
    this.http.get(`${this.serviceUrl}/search?query=${this.searchTitle}`).subscribe((data :any)=> {
      this.posts = data.hits.hits;
    })
  }

  addPost() {
    console.log(this.addPostForm.controls)
    const newPost = {
      title: this.addPostForm.controls.title.value,
      author: this.addPostForm.controls.author.value,
      content: this.addPostForm.controls.content.value
    }
    this.http.post(`${this.serviceUrl}/create-post`, newPost).subscribe(()=> {
      this.posts.push({
        _source: newPost
      });
      this.showAddDialog = false;
    })
  }

  deletePost(postId: any, idx: number) {
    this.http.delete(`${this.serviceUrl}/remove-post?id=${postId}`).subscribe(() => {
      this.posts.splice(idx, 1);
    })
  }
}
