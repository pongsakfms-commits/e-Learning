<?php

namespace App\Mail;

use App\Models\AssessmentResult;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AssessmentResultMail extends Mailable
{
    use Queueable, SerializesModels;

    protected array $pdfAttachments;

    public function __construct(
        protected AssessmentResult $assessmentResult,
        /** @var array<string, string> $attachments */
        array $attachments = []
    ) {
        $this->pdfAttachments = $attachments;
        $this->subject = __('Assessment Result: :assessment', [
            'assessment' => $assessmentResult->assessment->title,
        ]);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.assessment-result',
            with: [
                'result' => $this->assessmentResult,
                'assessment' => $this->assessmentResult->assessment,
                'course' => $this->assessmentResult->assessment->course,
                'user' => $this->assessmentResult->user,
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        foreach ($this->pdfAttachments as $type => $binary) {
            $filename = match ($type) {
                'certificate' => sprintf('certificate-%s.pdf', $this->assessmentResult->id),
                default => sprintf('assessment-report-%s.pdf', $this->assessmentResult->id),
            };

            $attachments[] = Attachment::fromData(fn () => $binary, $filename)
                ->withMime('application/pdf');
        }

        return $attachments;
    }
}
