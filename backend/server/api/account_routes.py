from typing import Annotated

from fastapi import APIRouter, Depends

from backend.actions.add_account import add_account
from backend.actions.edit_account import edit_account
from backend.actions.list_accounts import list_accounts
from backend.actions.remove_account import remove_account
from backend.actions.storage_interfaces.account_storage import AccountStorage
from backend.business_rules.account import Account
from backend.connections.browser_responses.account_response import account_response
from backend.connections.request_data.account_changes import read_account_changes
from backend.server.current_user import current_user
from backend.server.request_data.account_input import AccountInput
from backend.server.storage_dependencies import account_storage


router = APIRouter(prefix="/api/accounts")
CurrentUser = Annotated[Account, Depends(current_user)]
Accounts = Annotated[AccountStorage, Depends(account_storage)]


@router.get("")
def list_accounts_route(actor: CurrentUser, storage: Accounts) -> dict:
    return {"accounts": [account_response(account) for account in list_accounts(actor, storage)]}


@router.post("", status_code=201)
def add_account_route(body: AccountInput, actor: CurrentUser, storage: Accounts) -> dict:
    changes = read_account_changes(body.model_dump(exclude_none=True))
    return {"account": account_response(add_account(actor, changes, storage))}


@router.patch("/{identifier}")
def edit_account_route(identifier: str, body: AccountInput, actor: CurrentUser, storage: Accounts) -> dict:
    changes = read_account_changes(body.model_dump(exclude_none=True))
    return {"account": account_response(edit_account(actor, identifier, changes, storage))}


@router.delete("/{identifier}", status_code=204)
def remove_account_route(identifier: str, actor: CurrentUser, storage: Accounts) -> None:
    remove_account(actor, identifier, storage)
