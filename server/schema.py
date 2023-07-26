import datetime
from enum import Enum
from typing import List

from django.contrib.auth import get_user_model
from ninja import ModelSchema, Schema

from server.models import Membership, Player, Vaccination

User = get_user_model()


class Credentials(Schema):
    username: str
    password: str


class FirebaseCredentials(Schema):
    token: str
    uid: str


class Response(Schema):
    message: str


class MembershipSchema(ModelSchema):
    class Config:
        model = Membership
        model_fields = "__all__"


class OrderTypeEnum(str, Enum):
    MEMBERSHIP = "membership"


class OrderFormSchema(Schema):
    amount: int
    player_id: int
    type: OrderTypeEnum
    start_date: datetime.date
    end_date: datetime.date


class PaymentFormSchema(Schema):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class OrderSchema(Schema):
    order_id: str
    amount: int
    currency: str
    receipt: str
    key: str
    name: str
    image: str
    description: str
    prefill: dict


class PlayerSchema(ModelSchema):
    full_name: str

    @staticmethod
    def resolve_full_name(player):
        return player.user.get_full_name()

    membership: MembershipSchema = None

    @staticmethod
    def resolve_membership(player):
        try:
            return MembershipSchema.from_orm(player.membership)
        except Membership.DoesNotExist:
            return

    class Config:
        model = Player
        model_fields = "__all__"


class UserSchema(ModelSchema):
    player: PlayerSchema = None

    @staticmethod
    def resolve_player(user):
        try:
            return PlayerSchema.from_orm(user.player_profile)
        except Player.DoesNotExist:
            return

    players: List[PlayerSchema]

    @staticmethod
    def resolve_players(user):
        players = Player.objects.filter(guardianship__user=user)
        return [PlayerSchema.from_orm(p) for p in players]

    class Config:
        model = User
        model_fields = [
            "username",
            "email",
            "phone",
            "is_player",
            "is_guardian",
            "first_name",
            "last_name",
        ]


class VaccinationSchema(ModelSchema):
    class Config:
        model = Vaccination
        model_fields = "__all__"

class UserFormSchema(ModelSchema):
    class Config:
        model = User
        model_fields = ["first_name", "last_name", "phone"]


class PlayerFormSchema(ModelSchema):
    class Config:
        model = Player
        model_exclude = ["user"]
        model_fields_optional = "__all__"

class VaccinationFormSchema(ModelSchema):
    class Config:
        model = Vaccination
        model_exclude = ["player"]

class RegistrationSchema(UserFormSchema, PlayerFormSchema):
    pass
