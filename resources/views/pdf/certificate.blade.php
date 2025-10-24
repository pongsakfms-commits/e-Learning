<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ __('Certificate of Achievement') }}</title>
    <style>
        @page { margin: 12mm; }
        body { 
            font-family: 'DejaVu Serif', serif; 
            margin: 0; 
            padding: 60px 80px;
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
        }
        .certificate-container {
            border: 16px solid #1b365d;
            border-image: linear-gradient(135deg, #1b365d, #2563eb) 1;
            padding: 50px;
            text-align: center;
            position: relative;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            background: #ffffff;
        }
        .ornament {
            width: 100%;
            height: 40px;
            background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCI+PHBhdGggZmlsbD0iIzFiMzY1ZCIgZD0iTTQwIDIwYzAtNS41MiA0LjQ4LTEwIDEwLTEwczEwIDQuNDggMTAgMTAtNC40OCAxMC0xMCAxMC0xMC00LjQ4LTEwLTEweiBNMjAgMjBjMC01LjUyIDQuNDgtMTAgMTAtMTBzMTAgNC40OCAxMCAxMC00LjQ4IDEwLTEwIDEwLTEwLTQuNDgtMTAtMTB6IE02MCAyMGMwLTUuNTIgNC40OC0xMCAxMC0xMHMxMCA0LjQ4IDEwIDEwLTQuNDggMTAtMTAgMTAtMTAtNC40OC0xMC0xMHoiLz48L3N2Zz4=') repeat-x center;
            margin: 0 auto 20px;
        }
        .title { 
            font-size: 48px; 
            color: #1b365d; 
            margin: 20px 0 10px;
            font-weight: 300;
            letter-spacing: 6px;
            text-transform: uppercase;
        }
        .subtitle { 
            font-size: 18px; 
            color: #6b7280; 
            margin-bottom: 40px;
            letter-spacing: 3px;
            text-transform: uppercase;
        }
        .awarded-to {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 10px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .recipient-name {
            font-size: 40px;
            color: #1b365d;
            font-weight: 700;
            margin: 15px 0 30px;
            border-bottom: 2px solid #1b365d;
            display: inline-block;
            padding: 0 40px 8px;
        }
        .citation {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.8;
            margin: 25px 60px;
        }
        .achievement {
            font-weight: 600;
            color: #1b365d;
        }
        .details {
            display: flex;
            justify-content: space-around;
            margin-top: 50px;
            font-size: 13px;
        }
        .detail-item {
            text-align: center;
            flex: 1;
        }
        .detail-label {
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 10px;
            margin-bottom: 5px;
        }
        .detail-value {
            color: #1f2937;
            font-weight: 600;
            font-size: 14px;
        }
        .seal {
            width: 80px;
            height: 80px;
            border: 3px solid #1b365d;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #1b365d;
            font-size: 10px;
            text-align: center;
            margin: 30px auto 0;
            background: radial-gradient(circle, #f0f9ff, #dbeafe);
        }
        .date-issued {
            margin-top: 30px;
            font-size: 11px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="ornament"></div>
        
        <h1 class="title">{{ __('Certificate') }}</h1>
        <p class="subtitle">{{ __('of Achievement') }}</p>
        
        <div class="awarded-to">{{ __('This is to certify that') }}</div>
        
        <div class="recipient-name">{{ $user->name }}</div>
        
        <p class="citation">
            {{ __('Has successfully completed the assessment') }} 
            <span class="achievement">"{{ $assessment->title }}"</span> 
            {{ __('as part of the course') }} 
            <span class="achievement">{{ $course->title }}</span>, 
            {{ __('demonstrating exceptional understanding and mastery of the subject matter with a score of') }}
            <span class="achievement">{{ number_format($result->percentage, 2) }}%</span>.
        </p>
        
        <div class="details">
            <div class="detail-item">
                <div class="detail-label">{{ __('Course') }}</div>
                <div class="detail-value">{{ $course->title }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">{{ __('Assessment') }}</div>
                <div class="detail-value">{{ $assessment->title }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">{{ __('Score') }}</div>
                <div class="detail-value">{{ number_format($result->percentage, 2) }}%</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">{{ __('Grade') }}</div>
                <div class="detail-value">{{ $result->grade() }}</div>
            </div>
        </div>
        
        <div class="seal">
            <div>
                <div style="font-size: 16px;">✓</div>
                <div>{{ __('PASSED') }}</div>
            </div>
        </div>
        
        <div class="date-issued">
            {{ __('Issued on :date', ['date' => $result->completed_at?->format('d F Y') ?? now()->format('d F Y')]) }}<br>
            {{ __('Certificate ID: :id', ['id' => sprintf('CERT-%06d', $result->id)]) }}
        </div>
    </div>
</body>
</html>
