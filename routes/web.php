<?php

use App\Http\Controllers\AssessmentReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('assessment-results/{assessmentResult}')->name('assessment-results.')->group(function () {
    Route::get('report', [AssessmentReportController::class, 'downloadReport'])->name('report');
    Route::get('certificate', [AssessmentReportController::class, 'downloadCertificate'])->name('certificate');
    Route::post('email', [AssessmentReportController::class, 'emailReport'])->name('email');
});
