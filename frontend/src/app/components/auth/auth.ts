import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
  <div class="relative w-full max-w-5xl h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden">
    
    <!-- Sign In Form -->
    <div 
      class="absolute top-0 w-[65%] h-full p-8 flex flex-col justify-center transition-all duration-[1200ms] ease-in-out"
      [ngStyle]="{'left': isSignUp ? '100%' : '0'}"
    >
      <div class="max-w-md mx-auto w-full">
        <h2 class="text-4xl font-bold text-gray-800 text-center mb-8">Welcome Back</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="space-y-6">
          <div>
            <label class="block text-center">
              <span class="text-xs uppercase tracking-wide text-gray-400 font-semibold block mb-2">Email</span>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-2 text-center border-b-2 border-gray-300 focus:border-purple-500 outline-none transition-colors text-gray-700 bg-transparent"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <div>
            <label class="relative block text-center">
              <span class="text-xs uppercase tracking-wide text-gray-400 font-semibold block mb-2">Password</span>
              <input
                [type]="loginPasswordVisible ? 'text' : 'password'"
                formControlName="password"
                class="w-full px-4 py-2 text-center border-b-2 border-gray-300 focus:border-purple-500 outline-none transition-colors text-gray-700 bg-transparent"
                placeholder="••••••••"
              />
              <button type="button" (click)="loginPasswordVisible = !loginPasswordVisible" class="absolute right-2 top-1/2 -translate-y-1/2 mt-2 text-gray-500 hover:text-purple-600">
                <svg *ngIf="!loginPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg *ngIf="loginPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </label>
          </div>

          <div *ngIf="errorMessage && !isSignUp" class="text-center text-red-600 text-sm">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="loading || loginForm.invalid"
            class="w-full max-w-xs mx-auto block bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-semibold py-3 rounded-full hover:from-yellow-700 hover:to-yellow-600 transition-all shadow-lg uppercase text-sm tracking-wide disabled:opacity-50"
          >
            <span *ngIf="!loading">Sign In</span>
            <span *ngIf="loading">Signing in...</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Sign Up Form -->
    <div 
      class="absolute top-0 w-[65%] h-full p-8 flex flex-col justify-center transition-all duration-[1200ms] ease-in-out"
      [ngStyle]="{'left': isSignUp ? '35%' : '100%'}"
    >
      <div class="max-w-md mx-auto w-full">
        <h2 class="text-4xl font-bold text-gray-800 text-center mb-6">Create Account</h2>
        
        <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="space-y-5">
          <div>
            <label class="block text-center">
              <span class="text-xs uppercase tracking-wide text-gray-400 font-semibold block mb-2">Name</span>
              <input
                type="text"
                formControlName="name"
                class="w-full px-4 py-2 text-center border-b-2 border-gray-300 focus:border-purple-500 outline-none transition-colors text-gray-700 bg-transparent"
                placeholder="John Doe"
              />
            </label>
          </div>

          <div>
            <label class="block text-center">
              <span class="text-xs uppercase tracking-wide text-gray-400 font-semibold block mb-2">Email</span>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-2 text-center border-b-2 border-gray-300 focus:border-purple-500 outline-none transition-colors text-gray-700 bg-transparent"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <div>
            <label class="relative block text-center">
              <span class="text-xs uppercase tracking-wide text-gray-400 font-semibold block mb-2">Password</span>
              <input
                [type]="registerPasswordVisible ? 'text' : 'password'"
                formControlName="password"
                class="w-full px-4 py-2 text-center border-b-2 border-gray-300 focus:border-purple-500 outline-none transition-colors text-gray-700 bg-transparent"
                placeholder="Minimum 6 characters"
              />
              <button type="button" (click)="registerPasswordVisible = !registerPasswordVisible" class="absolute right-2 top-1/2 -translate-y-1/2 mt-2 text-gray-500 hover:text-purple-600">
                <svg *ngIf="!registerPasswordVisible" xmlns="http://www.w.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg *ngIf="registerPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </label>
          </div>

          <div>
            <label class="relative block text-center">
              <span class="text-xs uppercase tracking-wide text-gray-400 font-semibold block mb-2">Confirm Password</span>
              <input
                [type]="confirmPasswordVisible ? 'text' : 'password'"
                formControlName="confirmPassword"
                class="w-full px-4 py-2 text-center border-b-2 border-gray-300 focus:border-purple-500 outline-none transition-colors text-gray-700 bg-transparent"
                placeholder="Re-enter password"
              />
              <button type="button" (click)="confirmPasswordVisible = !confirmPasswordVisible" class="absolute right-2 top-1/2 -translate-y-1/2 mt-2 text-gray-500 hover:text-purple-600">
                <svg *ngIf="!confirmPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg *ngIf="confirmPasswordVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              </button>
            </label>
            <div *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched" class="text-center text-red-600 text-sm mt-1">
              Passwords do not match.
            </div>
          </div>

          <div *ngIf="errorMessage && isSignUp" class="text-center text-red-600 text-sm">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="loading || registerForm.invalid"
            class="w-full max-w-xs mx-auto block bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-semibold py-3 rounded-full hover:from-yellow-700 hover:to-yellow-600 transition-all shadow-lg uppercase text-sm tracking-wide disabled:opacity-50"
          >
            <span *ngIf="!loading">Sign Up</span>
            <span *ngIf="loading">Creating account...</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Sliding Purple Panel -->
    <div 
      class="absolute top-0 w-[35%] h-full bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 transition-all duration-[1200ms] ease-in-out flex items-center justify-center z-10"
      [ngStyle]="{'left': isSignUp ? '0' : '65%'}"
    >
      <div class="relative w-full h-full flex items-center justify-center p-6">
        <div 
          class="text-center text-white transition-all duration-[1200ms] ease-in-out absolute px-4"
          [class.opacity-0]="isSignUp"
          [class.pointer-events-none]="isSignUp"
          [class.opacity-100]="!isSignUp"
        >
          <h3 class="text-2xl font-bold mb-4">Hello, Friend!</h3>
          <p class="text-purple-100 mb-6 text-sm leading-relaxed">
            Enter your personal details and start your journey with us
          </p>
          <button
            type="button"
            (click)="toggleMode()"
            class="px-8 py-2.5 border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-600 transition-all font-semibold uppercase text-xs tracking-wide"
          >
            Sign Up
          </button>
        </div>

        <div 
          class="text-center text-white transition-all duration-[1200ms] ease-in-out absolute px-4"
          [class.opacity-0]="!isSignUp"
          [class.pointer-events-none]="!isSignUp"
          [class.opacity-100]="isSignUp"
        >
          <h3 class="text-2xl font-bold mb-4">Welcome Back!</h3>
          <p class="text-purple-100 mb-6 text-sm leading-relaxed">
            To keep connected with us please login with your personal info
          </p>
          <button
            type="button"
            (click)="toggleMode()"
            class="px-8 py-2.5 border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-600 transition-all font-semibold uppercase text-xs tracking-wide"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  `
})
export class AuthComponent implements OnInit {
  isSignUp = false;
  errorMessage = '';
  loading = false;
  loginPasswordVisible = false;
  registerPasswordVisible = false;
  confirmPasswordVisible = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  };

  toggleMode(): void {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.router.navigate(['/todos']),
        error: (error) => this.errorMessage = error.error.message || 'Login failed'
      });
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const { name, email, password } = this.registerForm.value;
    this.authService.register(name, email, password)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.router.navigate(['/todos']),
        error: (error) => this.errorMessage = error.error.message || 'Registration failed'
      });
  }
}