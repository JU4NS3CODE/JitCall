import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestCallPage } from './test-call.page';

describe('TestCallPage', () => {
  let component: TestCallPage;
  let fixture: ComponentFixture<TestCallPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
