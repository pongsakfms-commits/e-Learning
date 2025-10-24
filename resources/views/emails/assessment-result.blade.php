@component('mail::message')
# {{ __('Assessment Results Available') }}

{{ __('Hello :name,', ['name' => $user->name]) }}

{{ __('Your results for the assessment **:assessment** in the course **:course** are now available.', [
    'assessment' => $assessment->title,
    'course' => $course->title,
]) }}

@component('mail::panel')
**{{ __('Score') }}:** {{ $result->scoreLabel() }} ({{ number_format($result->percentage, 2) }}%)  
**{{ __('Status') }}:** {{ $result->passed ? __('Passed') : __('Not Passed') }}  
**{{ __('Completed at') }}:** {{ $result->completionDate() ?? __('Pending completion') }}
@endcomponent

{{ __('You will find your personalized assessment report attached.') }}

@if($result->passed)
{{ __('A certificate of achievement is also attached for your records.') }}
@endif

{{ __('If you have any questions or need further assistance, please contact your instructor or learning administrator.') }}

{{ __('Regards,') }}  
{{ config('app.name') }}
@endcomponent
