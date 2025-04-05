from bs4 import BeautifulSoup
import httpx
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass
from urllib.parse import urljoin
import re
import wcag_contrast_ratio as wcag

@dataclass
class AccessibilityIssue:
    type: str
    element: str
    location: str
    severity: str
    impact: str
    description: str
    code_snippet: str
    wcag_criteria: str

class WCAGChecker:
    async def analyze_url(self, url: str) -> Dict[str, Any]:
        html_content = await self._fetch_page(url)
        soup = BeautifulSoup(html_content, 'html.parser')
        
        issues = []
        # WCAG checks
        issues.extend(self._check_images(soup))
        issues.extend(self._check_forms(soup))
        issues.extend(self._check_landmarks(soup))
        issues.extend(self._check_headings(soup))
        issues.extend(self._check_links(soup))
        issues.extend(self._check_contrast(soup))
        issues.extend(self._check_keyboard_nav(soup))
        issues.extend(self._check_tables(soup))
        issues.extend(self._check_iframes(soup))
        
        # Nielsen's Heuristics checks
        issues.extend(self._check_visibility_of_system_status(soup))
        issues.extend(self._check_match_between_system_and_real_world(soup))
        issues.extend(self._check_user_control_and_freedom(soup))
        issues.extend(self._check_consistency_and_standards(soup))
        issues.extend(self._check_error_prevention(soup))
        issues.extend(self._check_recognition_over_recall(soup))
        issues.extend(self._check_flexibility_and_efficiency(soup))
        issues.extend(self._check_aesthetic_and_minimalist_design(soup))
        issues.extend(self._check_help_users_with_errors(soup))
        issues.extend(self._check_help_and_documentation(soup))
        
        metrics = self._calculate_metrics(soup, issues)
        categorized_issues = self._categorize_issues(issues)
        score = self._calculate_score(issues)
        
        severity_counts = {
            "critical": len([i for i in issues if i.severity == "critical"]),
            "serious": len([i for i in issues if i.severity == "serious"]),
            "moderate": len([i for i in issues if i.severity == "moderate"]),
            "minor": len([i for i in issues if i.severity == "minor"])
        }
        
        return {
            "url": url,
            "compliance_score": score,
            "summary": {
                "total_issues": len(issues),
                **severity_counts
            },
            "issues_by_type": categorized_issues,
            "recommendations": self._generate_recommendations(issues),
            "metrics": metrics
        }

    async def _fetch_page(self, url: str) -> str:
        timeout = httpx.Timeout(30.0)
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = await client.get(url, headers=headers)
            return response.text

    def _check_images(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        for img in soup.find_all('img'):
            if not img.get('alt'):
                issues.append(AccessibilityIssue(
                    type="missing_alt_text",
                    element="img",
                    location=f"Image: {img.get('src', 'unknown')}",
                    severity="serious",
                    impact="Screen readers cannot describe the image content",
                    description="Image missing alternative text",
                    code_snippet=str(img),
                    wcag_criteria="WCAG 1.1.1 Non-text Content"
                ))
        return issues

    def _check_forms(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        for input_el in soup.find_all(['input', 'select', 'textarea']):
            if not input_el.get('id') or not soup.find('label', attrs={'for': input_el['id']}):
                issues.append(AccessibilityIssue(
                    type="missing_label",
                    element=input_el.name,
                    location=f"Form control: {input_el.get('name', 'unknown')}",
                    severity="critical",
                    impact="Screen reader users cannot identify form controls",
                    description="Form control missing associated label",
                    code_snippet=str(input_el),
                    wcag_criteria="WCAG 3.3.2 Labels or Instructions"
                ))
        return issues

    def _check_landmarks(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        landmarks = ['header', 'nav', 'main', 'footer', 'article', 'aside', 'section']
        issues = []
        for tag in landmarks:
            if not soup.find(tag):
                issues.append(AccessibilityIssue(
                    type="missing_landmark",
                    element=tag,
                    location="Document structure",
                    severity="moderate",
                    impact="Difficult to navigate page structure",
                    description=f"Missing {tag} landmark",
                    code_snippet="N/A",
                    wcag_criteria="WCAG 1.3.1 Info and Relationships"
                ))
        return issues

    def _check_headings(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        current_level = 0
        
        for heading in headings:
            level = int(heading.name[1])
            
            if level == 1 and current_level > 0:
                issues.append(AccessibilityIssue(
                    type="heading_structure",
                    element=heading.name,
                    location=f"Heading: {heading.text.strip()}",
                    severity="moderate",
                    impact="Improper heading structure affects navigation",
                    description="Multiple h1 tags found",
                    code_snippet=str(heading),
                    wcag_criteria="WCAG 2.4.6 Headings and Labels"
                ))
            elif level > current_level + 1:
                issues.append(AccessibilityIssue(
                    type="heading_structure",
                    element=heading.name,
                    location=f"Heading: {heading.text.strip()}",
                    severity="moderate",
                    impact="Improper heading structure affects navigation",
                    description=f"Heading level skipped from h{current_level} to h{level}",
                    code_snippet=str(heading),
                    wcag_criteria="WCAG 2.4.6 Headings and Labels"
                ))
            
            current_level = level
        
        return issues

    def _check_links(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        for link in soup.find_all('a'):
            if not link.get('href'):
                issues.append(AccessibilityIssue(
                    type="missing_href",
                    element="a",
                    location=f"Link text: {link.text.strip()}",
                    severity="serious",
                    impact="Links without href are not accessible",
                    description="Link missing href attribute",
                    code_snippet=str(link),
                    wcag_criteria="WCAG 2.4.4 Link Purpose (In Context)"
                ))
            elif not link.text.strip():
                issues.append(AccessibilityIssue(
                    type="empty_link",
                    element="a",
                    location=f"Link: {link.get('href', 'unknown')}",
                    severity="serious",
                    impact="Empty links are not accessible",
                    description="Link has no text",
                    code_snippet=str(link),
                    wcag_criteria="WCAG 2.4.4 Link Purpose (In Context)"
                ))
        return issues

    def _check_contrast(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        for element in soup.find_all(['p', 'span', 'div', 'a', 'li', 'button']):
            style = element.get('style', '')
            color_match = re.search(r'color:\s*([^;]+)', style)
            bg_color_match = re.search(r'background-color:\s*([^;]+)', style)
            if color_match and bg_color_match:
                color = color_match.group(1)
                bg_color = bg_color_match.group(1)
                ratio = wcag.contrast_ratio(color, bg_color)
                if ratio < 4.5:
                    issues.append(AccessibilityIssue(
                        type="low_contrast",
                        element=element.name,
                        location=f"Element: {element.text.strip()}",
                        severity="serious",
                        impact="Low contrast text is hard to read",
                        description="Text has insufficient color contrast",
                        code_snippet=str(element),
                        wcag_criteria="WCAG 1.4.3 Contrast (Minimum)"
                    ))
        return issues

    def _check_keyboard_nav(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        interactive_elements = soup.find_all(['button', 'a', 'input', 'select', 'textarea'])
        
        for element in interactive_elements:
            if element.get('tabindex') == '-1' or element.get('disabled'):
                issues.append(AccessibilityIssue(
                    type="keyboard_navigation",
                    element=element.name,
                    location=f"Element: {element.get('id', 'unknown')}",
                    severity="critical",
                    impact="Element cannot be accessed via keyboard",
                    description="Interactive element not keyboard accessible",
                    code_snippet=str(element),
                    wcag_criteria="WCAG 2.1.1 Keyboard"
                ))
        return issues

    def _check_tables(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        for table in soup.find_all('table'):
            if not table.find('th'):
                issues.append(AccessibilityIssue(
                    type="table_headers",
                    element="table",
                    location=f"Table: {table.get('id', 'unknown')}",
                    severity="serious",
                    impact="Screen readers cannot identify table structure",
                    description="Table missing header cells",
                    code_snippet=str(table),
                    wcag_criteria="WCAG 1.3.1 Info and Relationships"
                ))
        return issues

    def _check_iframes(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        for iframe in soup.find_all('iframe'):
            if not iframe.get('title'):
                issues.append(AccessibilityIssue(
                    type="iframe_title",
                    element="iframe",
                    location=f"Iframe: {iframe.get('src', 'unknown')}",
                    severity="serious",
                    impact="Screen readers cannot identify iframe content",
                    description="Iframe missing title attribute",
                    code_snippet=str(iframe),
                    wcag_criteria="WCAG 4.1.2 Name, Role, Value"
                ))
        return issues

    def _categorize_issues(self, issues: List[AccessibilityIssue]) -> Dict[str, List[Dict]]:
        categorized = {}
        for issue in issues:
            if issue.type not in categorized:
                categorized[issue.type] = []
            categorized[issue.type].append({
                "element": issue.element,
                "location": issue.location,
                "severity": issue.severity,
                "impact": issue.impact,
                "description": issue.description,
                "code_snippet": issue.code_snippet,
                "wcag_criteria": issue.wcag_criteria
            })
        return categorized

    def _calculate_score(self, issues: List[AccessibilityIssue]) -> float:
        weights = {
            "critical": 10,
            "serious": 7,
            "moderate": 4,
            "minor": 1
        }
        total_weight = sum(weights[issue.severity] for issue in issues)
        max_score = 100
        return max(0, max_score - total_weight)

    def _generate_recommendations(self, issues: List[AccessibilityIssue]) -> List[Dict[str, str]]:
        recommendations = []
        for issue in issues:
            recommendations.append({
                "type": issue.type,
                "priority": issue.severity,
                "suggestion": f"Fix {issue.description.lower()} at {issue.location}",
                "impact": issue.impact,
                "wcag_criteria": issue.wcag_criteria
            })
        return recommendations

    def _calculate_metrics(self, soup: BeautifulSoup, issues: List[AccessibilityIssue]) -> Dict[str, Any]:
        # Get all elements and counts
        all_elements = soup.find_all()
        interactive_elements = soup.find_all(['a', 'button', 'input', 'select', 'textarea'])
        images = soup.find_all('img')
        forms = soup.find_all('form')
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        landmarks = soup.find_all(['header', 'nav', 'main', 'footer', 'article', 'aside'])
        
        # Calculate element counts
        element_counts = {
            "total": len(all_elements),
            "interactive": len(interactive_elements),
            "images": len(images),
            "forms": len(forms),
            "headings": len(headings),
            "landmarks": len(landmarks)
        }
        
        # Calculate accessibility coverage
        images_with_alt = len([img for img in images if img.get('alt')])
        form_controls = soup.find_all(['input', 'select', 'textarea'])
        labeled_controls = len([
            ctrl for ctrl in form_controls 
            if ctrl.get('id') and soup.find('label', attrs={'for': ctrl.get('id')})
        ])
        keyboard_nav_issues = len([i for i in issues if i.type == "keyboard_navigation"])
        
        accessibility_coverage = {
            "alt_text_coverage": self._calculate_percentage(images_with_alt, len(images)),
            "form_labels_coverage": self._calculate_percentage(labeled_controls, len(form_controls)),
            "interactive_elements_accessibility": self._calculate_percentage(
                len(interactive_elements) - keyboard_nav_issues,
                max(1, len(interactive_elements))
            )
        }
        
        # Calculate WCAG compliance scores
        wcag_compliance = {
            "perceivable": self._calculate_compliance_category(issues, ["missing_alt_text", "low_contrast"]),
            "operable": self._calculate_compliance_category(issues, ["keyboard_navigation", "heading_structure"]),
            "understandable": self._calculate_compliance_category(issues, ["missing_label", "empty_link"]),
            "robust": self._calculate_compliance_category(issues, ["iframe_title", "missing_landmark"])
        }
        
        # Calculate Nielsen's heuristics compliance scores
        heuristics_compliance = {
            "visibility_of_system_status": self._calculate_compliance_category(issues, ["visibility_of_system_status"]),
            "match_system_and_real_world": self._calculate_compliance_category(issues, ["match_system_and_real_world"]),
            "user_control_and_freedom": self._calculate_compliance_category(issues, ["user_control_and_freedom"]),
            "consistency_and_standards": self._calculate_compliance_category(issues, ["consistency_and_standards"]),
            "error_prevention": self._calculate_compliance_category(issues, ["error_prevention"]),
            "recognition_over_recall": self._calculate_compliance_category(issues, ["recognition_over_recall"]),
            "flexibility_and_efficiency": self._calculate_compliance_category(issues, ["flexibility_and_efficiency"]),
            "aesthetic_and_minimalist": self._calculate_compliance_category(issues, ["aesthetic_and_minimalist"]),
            "help_users_with_errors": self._calculate_compliance_category(issues, ["help_users_with_errors"]),
            "help_and_documentation": self._calculate_compliance_category(issues, ["help_and_documentation"])
        }

        return {
            "element_counts": element_counts,
            "accessibility_coverage": accessibility_coverage,
            "wcag_compliance": wcag_compliance,
            "heuristics_compliance": heuristics_compliance
        }

    def _calculate_percentage(self, part: int, whole: int) -> float:
        if whole == 0:
            return 100.0
        return round((part / whole) * 100, 2)

    def _calculate_compliance_category(self, issues: List[AccessibilityIssue], issue_types: List[str]) -> float:
        relevant_issues = len([i for i in issues if i.type in issue_types])
        if relevant_issues == 0:
            return 100.0
        return round(max(0, 100 - (relevant_issues * 15)), 2)

    def _check_visibility_of_system_status(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        # Check for loading indicators
        loading_indicators = soup.find_all(class_=re.compile(r'load(ing|er)|spinner|progress'))
        if not loading_indicators:
            issues.append(AccessibilityIssue(
                type="visibility_of_system_status",
                element="page",
                location="Entire page",
                severity="moderate",
                impact="Users may be uncertain about system state during operations",
                description="No visible loading indicators found",
                code_snippet="N/A",
                wcag_criteria="Nielsen's Heuristic 1: Visibility of System Status"
            ))
        
        # Check for feedback mechanisms
        forms = soup.find_all('form')
        for form in forms:
            if not form.find_all(['button[type="submit"]', 'input[type="submit"]']):
                issues.append(AccessibilityIssue(
                    type="visibility_of_system_status",
                    element="form",
                    location=f"Form: {form.get('id', 'unknown')}",
                    severity="moderate",
                    impact="Users cannot clearly submit form or receive feedback",
                    description="Form lacks clear submission mechanism",
                    code_snippet=str(form),
                    wcag_criteria="Nielsen's Heuristic 1: Visibility of System Status"
                ))
        
        return issues

    def _check_match_between_system_and_real_world(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        # Check for technical jargon in text
        jargon_patterns = [
            r'\b(backend|frontend|API|middleware|runtime|syntax|compiler|regex)\b',
            r'\b(execution|interface|protocol|parameter|function|variable|iterator)\b'
        ]
        
        text_elements = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'button'])
        for element in text_elements:
            text = element.get_text()
            for pattern in jargon_patterns:
                if re.search(pattern, text, re.IGNORECASE) and not element.find_parent('code') and not element.find_parent('pre'):
                    issues.append(AccessibilityIssue(
                        type="match_system_and_real_world",
                        element=element.name,
                        location=f"Text: {text[:30]}...",
                        severity="minor",
                        impact="Technical jargon may confuse non-technical users",
                        description="Content contains technical jargon without explanation",
                        code_snippet=str(element),
                        wcag_criteria="Nielsen's Heuristic 2: Match Between System and Real World"
                    ))
                    break
        
        return issues

    def _check_user_control_and_freedom(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        # Check for back buttons in multi-step processes
        forms = soup.find_all('form')
        for form in forms:
            steps = form.find_all(['fieldset', 'div'], class_=re.compile(r'step|page'))
            if len(steps) > 1:
                back_buttons = form.find_all(['button', 'a'], string=re.compile(r'back|previous|cancel', re.IGNORECASE))
                if not back_buttons:
                    issues.append(AccessibilityIssue(
                        type="user_control_and_freedom",
                        element="form",
                        location=f"Multi-step form: {form.get('id', 'unknown')}",
                        severity="moderate",
                        impact="Users cannot easily go back or cancel actions in progress",
                        description="Multi-step form lacks back/cancel options",
                        code_snippet=str(form),
                        wcag_criteria="Nielsen's Heuristic 3: User Control and Freedom"
                    ))
        
        # Check for exit options in modals/overlays
        modals = soup.find_all(['div', 'section'], class_=re.compile(r'modal|overlay|dialog|popup', re.IGNORECASE))
        for modal in modals:
            close_buttons = modal.find_all(['button', 'a'], string=re.compile(r'close|cancel|×|✕|✖', re.IGNORECASE))
            close_buttons.extend(modal.find_all(['button', 'a'], class_=re.compile(r'close|cancel|dismiss', re.IGNORECASE)))
            if not close_buttons:
                issues.append(AccessibilityIssue(
                    type="user_control_and_freedom",
                    element="modal",
                    location=f"Modal: {modal.get('id', 'unknown')}",
                    severity="serious",
                    impact="Users may be trapped in modal dialogs",
                    description="Modal/overlay lacks close mechanism",
                    code_snippet=str(modal),
                    wcag_criteria="Nielsen's Heuristic 3: User Control and Freedom"
                ))
        
        return issues

    def _check_consistency_and_standards(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        # Check for inconsistent button styling
        buttons = soup.find_all('button')
        button_classes = {}
        
        for button in buttons:
            if button.get('class'):
                for cls in button.get('class'):
                    if cls not in button_classes:
                        button_classes[cls] = 0
                    button_classes[cls] += 1
        
        # If there are buttons with inconsistent styling
        if len(buttons) > 3 and len(button_classes) > len(buttons) // 2:
            issues.append(AccessibilityIssue(
                type="consistency_and_standards",
                element="button",
                location="Throughout page",
                severity="minor",
                impact="Inconsistent design makes interface less intuitive",
                description="Buttons have inconsistent styling throughout the page",
                code_snippet="N/A",
                wcag_criteria="Nielsen's Heuristic 4: Consistency and Standards"
            ))
        
        # Check for non-standard form controls
        for form in soup.find_all('form'):
            custom_inputs = form.find_all(['div', 'span'], class_=re.compile(r'checkbox|radio|select|dropdown', re.IGNORECASE))
            if custom_inputs:
                native_equivalent = False
                for custom in custom_inputs:
                    if custom.find(['input[type="checkbox"]', 'input[type="radio"]', 'select']):
                        native_equivalent = True
                        break
                
                if not native_equivalent:
                    issues.append(AccessibilityIssue(
                        type="consistency_and_standards",
                        element="form",
                        location=f"Form: {form.get('id', 'unknown')}",
                        severity="moderate",
                        impact="Custom controls may behave unexpectedly compared to browser defaults",
                        description="Form uses custom controls instead of native HTML elements",
                        code_snippet=str(custom_inputs[0]),
                        wcag_criteria="Nielsen's Heuristic 4: Consistency and Standards"
                    ))
        
        return issues

    def _check_error_prevention(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        # Check for required fields
        for form in soup.find_all('form'):
            required_fields = form.find_all(['input', 'select', 'textarea'], {'required': True})
            required_fields.extend(form.find_all(['input', 'select', 'textarea'], {'aria-required': 'true'}))
            
            if required_fields:
                for field in required_fields:
                    label = soup.find('label', {'for': field.get('id', '')})
                    if label and not re.search(r'\*|required', label.get_text(), re.IGNORECASE):
                        issues.append(AccessibilityIssue(
                            type="error_prevention",
                            element=field.name,
                            location=f"Field: {field.get('name', 'unknown')}",
                            severity="moderate",
                            impact="Users may not realize a field is required until after submission",
                            description="Required field not visually indicated as required",
                            code_snippet=str(field),
                            wcag_criteria="Nielsen's Heuristic 5: Error Prevention"
                        ))
        
        # Check for confirmation on important actions
        delete_buttons = soup.find_all(['button', 'a'], string=re.compile(r'delete|remove|clear all', re.IGNORECASE))
        for button in delete_buttons:
            if not button.get('data-confirm') and not re.search(r'confirm|warning|alert', str(button.parent), re.IGNORECASE):
                issues.append(AccessibilityIssue(
                    type="error_prevention",
                    element=button.name,
                    location=f"Action: {button.get_text().strip()}",
                    severity="serious",
                    impact="Destructive actions without confirmation may lead to unintended data loss",
                    description="Potentially destructive action lacks confirmation step",
                    code_snippet=str(button),
                    wcag_criteria="Nielsen's Heuristic 5: Error Prevention"
                ))
        
        return issues

    def _check_recognition_over_recall(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        # Check for input placeholders that disappear
        for input_el in soup.find_all(['input', 'textarea']):
            if input_el.get('placeholder') and not input_el.get('title') and not input_el.get('aria-label'):
                issues.append(AccessibilityIssue(
                    type="recognition_over_recall",
                    element=input_el.name,
                    location=f"Input: {input_el.get('name', 'unknown')}",
                    severity="minor",
                    impact="Users must remember information after it disappears",
                    description="Input relies solely on placeholder text that disappears when typing",
                    code_snippet=str(input_el),
                    wcag_criteria="Nielsen's Heuristic 6: Recognition Rather Than Recall"
                ))
        
        # Check for help text availability
        complex_inputs = soup.find_all(['input[type="date"]', 'input[type="datetime-local"]', 'input[type="number"]', 'input[pattern]'])
        for input_el in complex_inputs:
            help_text = False
            input_id = input_el.get('id', '')
            # Check for adjacent help text
            if input_id:
                help_text = soup.find(['small', 'span', 'div'], {'id': re.compile(f"{input_id}-help|help-{input_id}")})
                if not help_text:
                    help_text = soup.find(['small', 'span', 'div'], {'aria-describedby': input_id})
            
            if not help_text and not input_el.get('title'):
                issues.append(AccessibilityIssue(
                    type="recognition_over_recall",
                    element=input_el.name,
                    location=f"Input: {input_el.get('name', 'unknown')}",
                    severity="moderate",
                    impact="Users must recall correct input format without guidance",
                    description="Complex input lacks helper text or format guidance",
                    code_snippet=str(input_el),
                    wcag_criteria="Nielsen's Heuristic 6: Recognition Rather Than Recall"
                ))
        
        return issues

    def _check_flexibility_and_efficiency(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        # Check for keyboard shortcuts
        main_content = soup.find('main') or soup.find('body')
        if main_content:
            has_keyboard_shortcuts = bool(main_content.find_all(attrs={'accesskey': True}))
            has_skip_links = bool(soup.find('a', href='#content') or soup.find('a', href='#main'))
            
            if not has_keyboard_shortcuts:
                issues.append(AccessibilityIssue(
                    type="flexibility_and_efficiency",
                    element="page",
                    location="Entire page",
                    severity="minor",
                    impact="Power users cannot use keyboard shortcuts for efficiency",
                    description="No keyboard shortcuts (accesskey) found for main actions",
                    code_snippet="N/A",
                    wcag_criteria="Nielsen's Heuristic 7: Flexibility and Efficiency of Use"
                ))
                
            if not has_skip_links:
                issues.append(AccessibilityIssue(
                    type="flexibility_and_efficiency",
                    element="navigation",
                    location="Page navigation",
                    severity="moderate",
                    impact="Keyboard users must tab through all navigation items on every page",
                    description="No skip navigation links found",
                    code_snippet="N/A",
                    wcag_criteria="Nielsen's Heuristic 7: Flexibility and Efficiency of Use"
                ))
        
        # Check for pagination without shortcuts
        pagination = soup.find(['div', 'nav'], class_=re.compile(r'pagination', re.IGNORECASE))
        if pagination:
            has_goto = bool(pagination.find(['input', 'select']))
            if not has_goto and len(pagination.find_all('a')) > 5:
                issues.append(AccessibilityIssue(
                    type="flexibility_and_efficiency",
                    element="pagination",
                    location="Pagination controls",
                    severity="minor",
                    impact="Users must click through many pages without direct access",
                    description="Pagination lacks 'go to page' functionality",
                    code_snippet=str(pagination),
                    wcag_criteria="Nielsen's Heuristic 7: Flexibility and Efficiency of Use"
                ))
        
        return issues

    def _check_aesthetic_and_minimalist_design(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        # Check for excessive text
        paragraphs = soup.find_all('p')
        long_paragraphs = [p for p in paragraphs if len(p.get_text()) > 500]
        if long_paragraphs:
            issues.append(AccessibilityIssue(
                type="aesthetic_and_minimalist",
                element="p",
                location=f"{len(long_paragraphs)} paragraphs",
                severity="minor",
                impact="Excessive text creates cognitive load and reduces readability",
                description="Multiple long paragraphs of text found",
                code_snippet=str(long_paragraphs[0]),
                wcag_criteria="Nielsen's Heuristic 8: Aesthetic and Minimalist Design"
            ))
        
        # Check for excessive nesting
        deeply_nested = soup.find_all(lambda tag: len(list(tag.parents)) > 10)
        if deeply_nested:
            issues.append(AccessibilityIssue(
                type="aesthetic_and_minimalist",
                element="structure",
                location="Document structure",
                severity="moderate",
                impact="Overly complex DOM structure impacts performance and maintainability",
                description="Excessively deep HTML nesting detected",
                code_snippet=str(deeply_nested[0]),
                wcag_criteria="Nielsen's Heuristic 8: Aesthetic and Minimalist Design"
            ))
        
        return issues

    def _check_help_users_with_errors(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        # Check for error message containers
        forms = soup.find_all('form')
        for form in forms:
            error_containers = form.find_all(['div', 'span'], class_=re.compile(r'error|invalid|alert', re.IGNORECASE))
            if not error_containers:
                issues.append(AccessibilityIssue(
                    type="help_users_with_errors",
                    element="form",
                    location=f"Form: {form.get('id', 'unknown')}",
                    severity="serious",
                    impact="Users cannot identify or fix form submission errors",
                    description="Form lacks error message containers",
                    code_snippet=str(form),
                    wcag_criteria="Nielsen's Heuristic 9: Help Users Recognize, Diagnose, and Recover from Errors"
                ))
        
        # Check for inline validation attributes
        inputs = soup.find_all(['input', 'textarea', 'select'])
        for input_el in inputs:
            has_validation = False
            if input_el.get('pattern') or input_el.get('min') or input_el.get('max') or input_el.get('required'):
                has_validation = True
                
                if has_validation and not input_el.get('title') and not (input_el.get('aria-describedby')):
                    issues.append(AccessibilityIssue(
                        type="help_users_with_errors",
                        element=input_el.name,
                        location=f"Input: {input_el.get('name', 'unknown')}",
                        severity="moderate",
                        impact="Users not informed about validation requirements",
                        description="Input with validation constraints lacks error explanation",
                        code_snippet=str(input_el),
                        wcag_criteria="Nielsen's Heuristic 9: Help Users Recognize, Diagnose, and Recover from Errors"
                    ))
        
        return issues

    def _check_help_and_documentation(self, soup: BeautifulSoup) -> List[AccessibilityIssue]:
        issues = []
        # Check for help/documentation links
        help_links = soup.find_all(['a', 'button'], string=re.compile(r'help|support|documentation|faq|guide', re.IGNORECASE))
        if not help_links:
            issues.append(AccessibilityIssue(
                type="help_and_documentation",
                element="page",
                location="Entire page",
                severity="minor",
                impact="Users cannot find help when needed",
                description="No help or documentation links found",
                code_snippet="N/A",
                wcag_criteria="Nielsen's Heuristic 10: Help and Documentation"
            ))
        
        # Check for tooltips on complex elements
        complex_elements = soup.find_all(['[role="application"]', '[role="dialog"]', '[data-toggle="tooltip"]'])
        for element in complex_elements:
            has_tooltip = element.get('title') or element.get('aria-describedby')
            if not has_tooltip:
                issues.append(AccessibilityIssue(
                    type="help_and_documentation",
                    element=element.name,
                    location=f"Element: {element.get('id', 'unknown')}",
                    severity="minor",
                    impact="Users lack contextual help for complex interface elements",
                    description="Complex UI element lacks tooltip or description",
                    code_snippet=str(element),
                    wcag_criteria="Nielsen's Heuristic 10: Help and Documentation"
                ))
        
        return issues
