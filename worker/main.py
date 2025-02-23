# Backend Something Something

# Allen WU
# Feb 22 2024

from openai import OpenAI
import os
import json
import sys
import time


class GPTAPIHelper:
    """Base Class to handle API calls with OpenAI."""

    def __init__(self, setup_message):
        self.SETUP_MSG = setup_message
        self._init_static()

    def _init_static(self) -> None:
        self.worker_path = os.path.dirname(__file__)
        self.config_path = os.path.join(self.worker_path, "config.json")

        # Initialize Config
        try:
            config = json.load(open(self.config_path))
        except FileNotFoundError:
            # Generate config file
            with open(self.config_path, "w", encoding="utf-8") as f:
                init_config = {"GPT_API": "[FILL_A_GPT_API_TOKEN_HERE]"}
                f.write(json.dumps(init_config, ensure_ascii=False, indent=4))
            print("Config not found. config.json Generated")
            time.sleep(5)
            sys.exit()

        self.GPT_API_KEY = config["GPT_API"]

        self.gpt_client = OpenAI(api_key=self.GPT_API_KEY)

    def get_completion(self, prompt: str) -> str:
        resp = self.gpt_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "developer", "content": self.SETUP_MSG},
                {"role": "user", "content": prompt},
            ],
            temperature=0,  # Ultra Focus
            stream=True,
        )

        # Use Streaming to trivially speed up.
        chunk_collection = []
        msg_collection = []

        for chunk in resp:
            chunk_collection.append(chunk)

            chunk_msg = chunk.choices[0].delta.content
            msg_collection.append(chunk_msg)

            if not (chunk.choices[0].finish_reason in ("stop", None)):
                return f"[ERR({chunk.choices[0].finish_reason})]"

        # Filtering out None
        msg_collection = [msg for msg in msg_collection if msg]

        resp_msg = "".join(msg_collection)
        return resp_msg


class Translator(GPTAPIHelper):
    """Handles Translating Duties using the Helper Base Class."""

    def __init__(self, setup_message):
        super(Translator, self).__init__(setup_message)


class Summarizer(GPTAPIHelper):
    """TLDR"""

    def __init__(self, setup_message):
        super(Summarizer, self).__init__(setup_message)


class ReReviewer(GPTAPIHelper):
    """Summarizing reviews given an +/- Sentiment."""

    def __init__(self, setup_message):
        super(ReReviewer, self).__init__(setup_message)


def main():
    # san_test = GPTAPIHelper("Test")
    translator_test = Translator("You are a translator [Insert Prompt Here]")
    summarizer_test = Summarizer("You are a Summarizer [Insert Prompt Here]")
    rereviewer_test = ReReviewer("You are a ReReviewer [Insert Prompt Here]")


if __name__ == "__main__":
    main()
