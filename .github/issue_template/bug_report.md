---
name: Bug report
about: Create a report to help us improve
description: Request a bug/issue fix  
title: ''
labels: bug, help wanted
assignees: ''

---
body:
  - type: markdown
    attributes:
      value: |
        Thanks for helping us to improve
  - type: textarea
    id: describe_the_bug
    attributes:
      label: Describe the bug
      description: Add the bug description.
      render: shell
    validations:
      required: true

  - type: textarea
    id: reproduce_the_bug
    attributes:
      label: Steps to reproduce the behavior
      description: Add steps to help us reproduce the bug.
      render: shell
      placeholder: |
        Steps to reproduce the behavior:
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error

  - type: textarea
    id: expected_behavior
    attributes:
      label: Expected Behavior
      description: A clear and concise description of what you expected to happen.
      render: shell

  - type: textarea
    id: expected_behavior
    attributes:
      label: Expected Behavior
      description: A clear and concise description of what you expected to happen.
      render: shell
  - type: textarea
    id: logs
    attributes:
      label: Relevant log output
      description: If applicable, provide relevant log output. No need for backticks here.
      render: shell
      placeholder: |
        Add logs or any other context about the problem here.
        - OS: [e.g. IOS]
        - Version: [e.g. v.1.1.1]
