import logging
import os
import random
import re
from typing import Optional, Tuple

import click
import pkg_resources
import toml


def read_template(template_name):
    """Read content from a template file."""
    template_path = pkg_resources.resource_filename(
        "preswald", f"templates/{template_name}.template"
    )
    with open(template_path) as f:
        return f.read()


GITHUB_USERNAME_REGEX = r"^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$"


def normalize_github_username(username: str) -> str:
    """Normalize username with multiple cleanup steps"""
    username = username.strip().lower()
    # Replace common invalid characters
    username = re.sub(r"[_@]+", "-", username)
    # Remove invalid characters
    username = re.sub(r"[^a-z0-9-]", "", username)
    # Collapse multiple hyphens
    username = re.sub(r"-+", "-", username)
    # Trim to length limits
    return username[:39].strip("-")


def validate_api_key(api_key: str) -> Tuple[bool, str]:
    """Validate Structured Cloud API key format"""
    if not api_key:
        return False, click.style("❌ API key cannot be empty", fg="red")

    # Format check: prswld- prefix followed by UUID
    pattern = r"^prswld-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$"
    if not re.fullmatch(pattern, api_key.lower()):
        error_msg = (
            click.style("❌ Invalid API key format!\n", fg="red")
            + click.style("Required format: ", fg="yellow")
            + "prswld-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\n"
            + click.style("Example: ", fg="yellow")
            + click.style("prswld-ab11bc24-927c-4962-820a-417312f3c55c", fg="cyan")
        )
        return False, error_msg

    return True, ""


def validate_github_username(username: str) -> Tuple[bool, str, Optional[str]]:
    """Return (is_valid, message, corrected_username)"""
    original = username
    normalized = normalize_github_username(username)

    # Check if normalization changed the input
    needs_correction = normalized != original

    if not normalized:
        return (False, "Empty after normalization", None)

    if not re.fullmatch(r"^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$", normalized):
        return (False, "Invalid format after normalization", None)

    if needs_correction:
        return (False, "Contains invalid characters", normalized)

    return (True, "", normalized)


def read_port_from_config(config_path: str, port: int):
    try:
        if os.path.exists(config_path):
            config = toml.load(config_path)
            if "project" in config and "port" in config["project"]:
                port = config["project"]["port"]
        return port
    except Exception as e:
        print(f"Warning: Could not load port config from {config_path}: {e}")


def configure_logging(config_path: Optional[str] = None, level: Optional[str] = None):
    """
    Configure logging globally for the application.

    Args:
        config_path: Path to preswald.toml file. If None, will look in current directory
        level: Directly specified logging level, overrides config file if provided
    """
    # Default configuration
    log_config = {
        "level": "INFO",
        "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    }

    # Try to load from config file
    if config_path is None:
        config_path = "preswald.toml"

    if os.path.exists(config_path):
        try:
            with open(config_path) as f:
                config = toml.load(f)
                if "logging" in config:
                    log_config.update(config["logging"])
        except Exception as e:
            print(f"Warning: Could not load logging config from {config_path}: {e}")

    # Command line argument overrides config file
    if level is not None:
        log_config["level"] = level

    # Configure logging
    logging.basicConfig(
        level=getattr(logging, log_config["level"].upper()),
        format=log_config["format"],
        force=True,  # This resets any existing handlers
    )

    # Create logger for this module
    logger = logging.getLogger(__name__)
    logger.debug(f"Logging configured with level {log_config['level']}")

    return log_config["level"]


def validate_slug(slug: str) -> bool:
    pattern = r"^[a-z0-9][a-z0-9-]*[a-z0-9]$"
    return bool(re.match(pattern, slug)) and len(slug) >= 3 and len(slug) <= 63


def get_project_slug(config_path: str) -> str:
    try:  # Proper 4-space indent
        config = toml.load(config_path)
        if "project" not in config:
            raise Exception("Missing [project] section")
        return config["project"]["slug"]
    except Exception as e:
        raise Exception(f"Error reading slug: {e}") from e


def generate_slug(base_name: str) -> str:
    base_slug = re.sub(r"[^a-zA-Z0-9]+", "-", base_name.lower()).strip("-")
    random_number = random.randint(100000, 999999)
    slug = f"{base_slug}-{random_number}"
    if not validate_slug(slug):
        slug = f"preswald-{random_number}"

    return slug
