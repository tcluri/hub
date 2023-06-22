from django import forms
from .models import User, Player, Guardian, Membership, Vaccination


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'phone']


class PlayerForm(forms.ModelForm):
    class Meta:
        model = Player
        fields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'city', 'state_ut', 'team_name',
                  'occupation', 'educational_institution', 'india_ultimate_profile', 'guardian']


class GuardianForm(forms.ModelForm):
    class Meta:
        model = Guardian
        fields = ['full_name', 'relation']


class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ['title', 'start_date', 'end_date']


class MembershipForm(forms.ModelForm):
    class Meta:
        model = Membership
        fields = ['player', 'is_annual', 'start_date', 'end_date', 'event', 'is_active']


class VaccinationForm(forms.ModelForm):
    class Meta:
        model = Vaccination
        fields = ['player', 'is_vaccinated', 'vaccination_name', 'vaccination_certificate', 'explain_not_vaccinated']
