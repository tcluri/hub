from django.shortcuts import render, redirect
from .forms import UserForm, PlayerConsentForm, PlayerForm, GuardianPermissionForm, GuardianParticipationRisk, GuardianForm, EventForm, MembershipForm, VaccinationForm
from .models import User

# Create your views here.
def home(request):
    return render(request, 'base.html')

def registration_view(request):
    if request.method == 'POST':
        user_form = UserForm(request.POST)
        player_form = PlayerForm(request.POST)
        guardian_form = GuardianForm(request.POST)
        event_form = EventForm(request.POST)
        membership_form = MembershipForm(request.POST)
        vaccination_form = VaccinationForm(request.POST)

        is_guardian = False
        is_player = False

        if 'guardian_consent_form' in request.POST and 'guardian_participation_risk_form' in request.POST:
            is_guardian = True
            guardian_consent_form = GuardianPermissionForm(request.POST)
            guardian_participation_risk_form = GuardianParticipationRisk(request.POST)
        elif 'player_consent_form' in request.POST:
            is_player = True
            player_consent_form = PlayerConsentForm(request.POST)

        if user_form.is_valid() and player_form.is_valid() and event_form.is_valid() and membership_form.is_valid() and vaccination_form.is_valid():
            user = user_form.save(commit=False)
            player = player_form.save(commit=False)
            if is_guardian and not is_player:
                guardian_consent_form.save(commit=False)
                guardian_participation_risk_form.save(commit=False)
            elif is_player and not is_guardian:
                player_consent_form.save(commit=False)
            guardian = guardian_form.save(commit=False)
            event = event_form.save(commit=False)
            membership = membership_form.save(commit=False)
            vaccination = vaccination_form.save(commit=False)

            return redirect('success')

    else:
        user_form = UserForm()
        player_form = PlayerForm()
        player_consent_form = PlayerConsentForm()
        guardian_consent_form = GuardianPermissionForm()
        guardian_participation_risk_form = GuardianParticipationRisk()
        guardian_form = GuardianForm()
        event_form = EventForm()
        membership_form = MembershipForm()
        vaccination_form = VaccinationForm()

    context = {
        'user_form': user_form,
        'player_form': player_form,
        'player_consent_form': player_consent_form,
        'guardian_consent_form': guardian_consent_form,
        'guardian_participation_risk_form': guardian_participation_risk_form,
        'guardian_form': guardian_form,
        'event_form': event_form,
        'membership_form': membership_form,
        'vaccination_form': vaccination_form
    }

    return render(request, 'registration.html', context)


def success_view(request):
    return render(request, 'success.html')
